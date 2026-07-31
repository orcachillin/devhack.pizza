import Core from "../../../../core.js";
import { FormValues } from "../../util/form.js";
import { formatMoney } from "../../util/money.js";
import StakeForm from "./StakeForm.js";

export default function StakeFormColumn(props: { values?: FormValues }) {
	const pizza = Core.services.pizza;

	return (
		<div>
			<StakeForm values={props.values} />
			<p class="stake-total">
				<span>Currently staked</span>
				<strong>${formatMoney(pizza.stakeValue)}</strong>
			</p>
		</div>
	);
}
