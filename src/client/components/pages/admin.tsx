import Core from "../../../core.js";
import { Session } from "../../../database/entities/Session.entity.js";
import PizzaService, { ConfigurablePaymentMethod } from "../../../services/pizza/pizzaService.js";
import { formValue, FormValues } from "../util/form.js";
import AdminPage from "./admin/AdminPage.js";

export const component = { id: "pages.admin" } as const;
export const route = "/admin";
export const noCache = true;

export async function get() {
	return <AdminPage />;
}

export async function post(props: FormValues) {
	const pizza = Core.services.pizza;
	const session = Core.services.context.get<Session | undefined>("session");

	if (!session) {
		return <AdminPage error="A browser session is required to manage the pizza run." values={props} />;
	}

	try {
		if (formValue(props.action) === "claim") {
			pizza.claimOwnership(session, formValue(props.buyerName));
			return <AdminPage notice="Ownership claimed. You can now update the pizza settings." />;
		}

		if (formValue(props.action) === "update") {
			const enabledPaymentMethods: Partial<Record<ConfigurablePaymentMethod, string>> = {};
			for (const method of PizzaService.CONFIGURABLE_PAYMENT_METHODS) {
				if (formValue(props[`enabled_${method}`])) {
					enabledPaymentMethods[method] = formValue(props[`payment_${method}`]);
				}
			}

			pizza.updateSettings(session, {
				buyerName: formValue(props.buyerName),
				sliceCount: Number(formValue(props.sliceCount)),
				enabledPaymentMethods,
			});
			await Core.services.sse.renderComponentToChannel("thermometer", "thermometer", "shared.thermometer", {
				height: pizza.stakeProgress,
				money: pizza.stakeValue,
			});
			return <AdminPage notice="Pizza settings saved." />;
		}

		if (formValue(props.action) === "unclaim") {
			pizza.unclaimOwnership(session);
			return <AdminPage notice="Ownership released. Anyone can now claim this pizza run." />;
		}

		throw new Error("Unknown admin action.");
	} catch (error) {
		return (
			<AdminPage
				error={error instanceof Error ? error.message : "Unable to update pizza settings."}
				values={props}
			/>
		);
	}
}
