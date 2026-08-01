import Core from "../../../core.js";
import PizzaService from "../../../services/pizza/pizzaService.js";
import BuyerPaymentInfoRow from "./BuyerPaymentInfoRow.js";

export const component = { id: "shared.buyer-payment-info" } as const;

export const BuyerPaymentInfoChannel = Core.services.sse.registerChannel(
	{
		pattern: /buyer-payment-info/,
	},
	"buyer-payment-info",
);

export default async function BuyerPaymentInfo() {
	const pizza = Core.services.pizza;

	return (
		<aside
			id="buyer-payment-info"
			class="stake-info"
			aria-labelledby="payment-info-title"
			sse-connect="/events/buyer-payment-info"
			sse-swap="buyer-payment-info"
			hx-swap="outerHTML"
		>
			<h2 id="payment-info-title">Buyer payment info</h2>
			{pizza.buyerSession ? (
				<dl>
					<div>
						<dt>Buyer</dt>
						<dd>{pizza.buyerName}</dd>
					</div>
					<div>
						<dt>Cash</dt>
						<dd>hand to {pizza.buyerName}</dd>
					</div>
					{PizzaService.CONFIGURABLE_PAYMENT_METHODS.map((method) => {
						const username = pizza.enabledPaymentMethods[method];
						return username ? <BuyerPaymentInfoRow method={method} username={username} /> : "";
					})}
				</dl>
			) : (
				<p>No buyer has claimed this pizza run yet.</p>
			)}

			<p class="stake-warning">
				A stake is a commitment to pay the amount you enter. Only stake money you intend to send; an unpaid
				stake leaves the buyer covering your share.
			</p>
		</aside>
	);
}

export const event = BuyerPaymentInfo;
