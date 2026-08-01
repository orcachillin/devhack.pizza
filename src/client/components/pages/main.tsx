import Core from "../../../core.js";
import MainPage from "./main/MainPage.js";
import { AdminStakesChannel } from "../shared/AdminStakes.js";
import { formValue, FormValues } from "../util/form.js";
import { formatMoney } from "../util/money.js";
import { StakeTotalChannel } from "../shared/StakeTotal.js";
import { ThermometerChannel } from "../shared/Thermometer.js";

export const component = { id: "pages.main" } as const;
export const route = "/";
export const noCache = true;

export async function get() {
	return <MainPage />;
}

export async function post(props: FormValues) {
	const pizza = Core.services.pizza;

	try {
		pizza.addStake(formValue(props.paymentMethod), formValue(props.paymentUsername), Number(formValue(props.value)));

		await Promise.all([
			Core.services.sse.renderComponentToChannel(
				ThermometerChannel,
				"thermometer",
				"shared.thermometer",
				{ height: pizza.stakeProgress, money: pizza.stakeValue },
			),
			Core.services.sse.renderComponentToChannel(
				StakeTotalChannel,
				"stake-total",
				"shared.stake-total",
			),
			pizza.buyerSession
				? Core.services.sse.renderComponentToSession(
					AdminStakesChannel,
					pizza.buyerSession.id,
					"admin-stakes",
					"shared.admin-stakes",
				)
				: Promise.resolve(),
		]);

		return <MainPage notice={`Stake added. The total is now $${formatMoney(pizza.stakeValue)}.`} />;
	} catch (error) {
		return (
			<MainPage
				error={error instanceof Error ? error.message : "Unable to add your stake."}
				values={props}
			/>
		);
	}
}
