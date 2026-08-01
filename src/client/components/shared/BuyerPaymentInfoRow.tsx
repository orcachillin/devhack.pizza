import PizzaService, { ConfigurablePaymentMethod } from "../../../services/pizza/pizzaService.js";

export default function BuyerPaymentInfoRow(props: { method: ConfigurablePaymentMethod; username: string }) {
	return (
		<div>
			<dt>{PizzaService.PAYMENT_METHOD_PRESETS[props.method].name}</dt>
			<dd>
				<a href={PizzaService.paymentLink(props.method, props.username)} target="_blank" rel="noopener noreferrer">
					{PizzaService.formatPaymentUsername(props.method, props.username)}
				</a>
			</dd>
		</div>
	);
}
