import Core from "../../../core.js";
import MainPage from "./main/MainPage.js";
import { formValue, FormValues } from "../util/form.js";
import { formatMoney } from "../util/money.js";
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

		await Core.services.sse.renderComponentToChannel(
			ThermometerChannel,
			"thermometer",
			"shared.thermometer",
			{ height: pizza.stakeProgress, money: pizza.stakeValue },
		);

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
