import Core from "../../../../core.js";
import PizzaService from "../../../../services/pizza/pizzaService.js";
import PaymentInfoRow from "./PaymentInfoRow.js";

export default function PaymentInfo() {
	const pizza = Core.services.pizza;

	return (
		<aside class="stake-info" aria-labelledby="payment-info-title">
			<h2 id="payment-info-title">Buyer payment info</h2>
			{pizza.buyerSession ? (
				<dl>
					<div><dt>Buyer</dt><dd>{pizza.buyerName}</dd></div>
					<div><dt>Cash</dt><dd>{pizza.buyerName}</dd></div>
					{PizzaService.CONFIGURABLE_PAYMENT_METHODS.map(method => {
						const username = pizza.enabledPaymentMethods[method];
						return username ? <PaymentInfoRow method={method} username={username} /> : "";
					})}
				</dl>
			) : (
				<p>No buyer has claimed this pizza run yet.</p>
			)}

			<p class="stake-warning">
				A stake is a commitment to pay the amount you enter. Only stake money you intend to send; an unpaid stake leaves the buyer covering your share.
			</p>
		</aside>
	);
}
