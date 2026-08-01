import Core from "../../../core.js";
import PizzaService from "../../../services/pizza/pizzaService.js";
import { formatMoney } from "../util/money.js";

export default function AdminStakeTableContent() {
	const pizza = Core.services.pizza;

	return (
		<>
			<thead><tr><th>Username</th><th>Method</th><th>Stake</th></tr></thead>
			<tbody>
				{pizza.stakes.map(stake => (
					<tr>
						<td>{stake.paymentMethod === "cash" ? stake.paymentUsername : PizzaService.formatPaymentUsername(stake.paymentMethod, stake.paymentUsername)}</td>
						<td>{PizzaService.PAYMENT_METHOD_PRESETS[stake.paymentMethod].name}</td>
						<td>${formatMoney(stake.value)}</td>
					</tr>
				))}
			</tbody>
			<tfoot><tr><th>Total</th><td></td><th>${formatMoney(pizza.stakeValue)}</th></tr></tfoot>
		</>
	);
}
