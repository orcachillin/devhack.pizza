import AbstractService from "../../base/abstractService.js";
import Core from "../../core.js";
import { Session } from "../../database/entities/Session.entity.js";
import cron, { ScheduledTask } from "node-cron";

export type ConfigurablePaymentMethod = "paypal" | "cashapp" | "venmo"
export type PaymentMethod = "cash" | ConfigurablePaymentMethod

export type PizzaSettings = {
    buyerName: string
    sliceCount: number
    enabledPaymentMethods: Partial<Record<ConfigurablePaymentMethod, string>>
}

export default class PizzaService extends AbstractService<"pizza"> {
    private resetTask?: ScheduledTask

    constructor() {
        super("pizza")
    }

    /**
     * goals, at cost per slice
     */
    public static readonly GOALS = {
        "Pagliacci's Pizza": {
            per: 2.875,
            add: 7
        },
        "Domino's Pizza": {
            per: 1.5,
            add: 8
        }
    }

    public static readonly PAYMENT_METHOD_PRESETS = {
        cash: {
            name: "Cash",
            placeholder: "Max",
            label: "Name"
        },
        paypal: {
            name: "Paypal",
            placeholder: "orcachillin",
            label: "Username",
            link: "https://paypal.me/"
        },
        cashapp: {
            name: "CashApp",
            placeholder: "orcachillin",
            prefix: "$",
            label: "Tag",
            link: "https://cash.app/$"
        },
        venmo: {
            name: "Venmo",
            placeholder: "orcachillin",
            prefix: "@",
            label: "username",
            link: "https://venmo.com/u/"
        }
    } as const

    public static readonly CONFIGURABLE_PAYMENT_METHODS = ["paypal", "cashapp", "venmo"] as const
    public static readonly PAYMENT_METHODS = ["cash", ...PizzaService.CONFIGURABLE_PAYMENT_METHODS] as const
    public static readonly DEFAULT_SLICE_COUNT = 32
    public static readonly RESET_SCHEDULE = "30 16 * * 4"
    public static readonly RESET_TIMEZONE = "America/Los_Angeles"

    // config

    public sliceCount: number = PizzaService.DEFAULT_SLICE_COUNT
    public buyerName: string = ''
    public buyerSession?: Session
    // cash is always enabled
    public enabledPaymentMethods: Partial<Record<keyof Omit<typeof PizzaService.PAYMENT_METHOD_PRESETS, "cash">, string>> = {}

    // state

    public stakes: { name: string, paymentMethod: keyof typeof PizzaService.PAYMENT_METHOD_PRESETS, paymentUsername: string, value: number }[] = []

    get stakeValue() {
        return this.stakes.reduce((v, c) => v + c.value, 0)
    }

    get goalValues() {
        return Object.entries(PizzaService.GOALS).map(([name, { per, add }]) => ({
            name,
            cost: this.sliceCount * per + add
        }))
    }

    get stakeGoal() {
        return Math.max(...this.goalValues.map(goal => goal.cost))
    }

    get stakeProgress() {
        return this.stakeGoal > 0 ? Math.min(this.stakeValue / this.stakeGoal, 1) : 0
    }

    get availablePaymentMethods(): PaymentMethod[] {
        return PizzaService.PAYMENT_METHODS.filter(method =>
            method === "cash" || Object.hasOwn(this.enabledPaymentMethods, method)
        )
    }

    public addStake(paymentMethod: string, paymentUsername: string, value: number): void {
        if (!PizzaService.PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)) {
            throw new Error("Select a valid payment method.")
        }

        const method = paymentMethod as PaymentMethod
        if (method !== "cash" && !Object.hasOwn(this.enabledPaymentMethods, method)) {
            throw new Error("That payment method is not currently available.")
        }

        const username = paymentUsername.trim()
        if (!username || username.length > 100) {
            throw new Error("Username must be between 1 and 100 characters.")
        }

        const normalizedValue = Math.round(value * 100) / 100
        if (!Number.isFinite(normalizedValue) || normalizedValue < 0.01 || normalizedValue > 10000) {
            throw new Error("Stake value must be between $0.01 and $10,000.")
        }

        this.stakes.push({
            name: username,
            paymentMethod: method,
            paymentUsername: username,
            value: normalizedValue
        })
    }

    public isBuyer(session?: Session): boolean {
        return Boolean(session && this.buyerSession?.id === session.id)
    }

    public claimOwnership(session: Session, buyerName: string): void {
        this.buyerName = this.validateBuyerName(buyerName)
        this.buyerSession = session
    }

    public unclaimOwnership(session: Session): void {
        if (!this.isBuyer(session)) {
            throw new Error("Only the current owner can unclaim this pizza run.")
        }

        this.buyerSession = undefined
    }

    public updateSettings(session: Session, settings: PizzaSettings): void {
        if (!this.isBuyer(session)) {
            throw new Error("Claim ownership before updating settings.")
        }

        const buyerName = this.validateBuyerName(settings.buyerName)
        if (!Number.isInteger(settings.sliceCount) || settings.sliceCount < 1 || settings.sliceCount > 500) {
            throw new Error("Slice count must be a whole number between 1 and 500.")
        }

        const enabledPaymentMethods: Partial<Record<ConfigurablePaymentMethod, string>> = {}
        for (const method of PizzaService.CONFIGURABLE_PAYMENT_METHODS) {
            const value = settings.enabledPaymentMethods[method]
            if (value === undefined) continue

            const normalizedValue = PizzaService.normalizePaymentUsername(method, value)
            if (!normalizedValue || normalizedValue.length > 100) {
                throw new Error(`${PizzaService.PAYMENT_METHOD_PRESETS[method].name} must be between 1 and 100 characters.`)
            }

            enabledPaymentMethods[method] = normalizedValue
        }

        this.buyerName = buyerName
        this.sliceCount = settings.sliceCount
        this.enabledPaymentMethods = enabledPaymentMethods
    }

    public static formatPaymentUsername(method: ConfigurablePaymentMethod, value: string): string {
        const preset = PizzaService.PAYMENT_METHOD_PRESETS[method]
        const prefix = "prefix" in preset ? preset.prefix : ""
        return `${prefix}${PizzaService.normalizePaymentUsername(method, value)}`
    }

    public static paymentLink(method: ConfigurablePaymentMethod, value: string): string {
        const preset = PizzaService.PAYMENT_METHOD_PRESETS[method]
        const username = PizzaService.normalizePaymentUsername(method, value)
        return `${preset.link}${encodeURIComponent(username)}`
    }

    private static normalizePaymentUsername(method: ConfigurablePaymentMethod, value: string): string {
        const preset = PizzaService.PAYMENT_METHOD_PRESETS[method]
        const prefix = "prefix" in preset ? preset.prefix : ""
        const username = value.trim()
        return prefix && username.startsWith(prefix) ? username.slice(prefix.length).trim() : username
    }

    private validateBuyerName(value: string): string {
        const buyerName = value.trim()
        if (!buyerName || buyerName.length > 80) {
            throw new Error("Buyer name must be between 1 and 80 characters.")
        }

        return buyerName
    }

    public async init(): Promise<void> {
        this.resetTask = cron.schedule(
            PizzaService.RESET_SCHEDULE,
            () => this.reset(),
            {
                name: "pizza-weekly-reset",
                timezone: PizzaService.RESET_TIMEZONE,
                noOverlap: true,
                unref: true
            }
        )

        this.logger.log(`Weekly reset scheduled for Thursday at 4:30 PM ${PizzaService.RESET_TIMEZONE}`)
    }

    public async reset(): Promise<void> {
        const previousBuyerSessionId = this.buyerSession?.id

        this.sliceCount = PizzaService.DEFAULT_SLICE_COUNT
        this.buyerName = ""
        this.buyerSession = undefined
        this.enabledPaymentMethods = {}
        this.stakes = []

        this.logger.log("Pizza run reset")

        await Core.services.sse?.renderComponentToChannel(
            "thermometer",
            "thermometer",
            "shared.thermometer",
            { height: this.stakeProgress, money: this.stakeValue }
        )
    }

    public async destroy(): Promise<void> {
        await this.resetTask?.destroy()
        this.resetTask = undefined
    }
}
