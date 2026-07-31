import PizzaService from "../../../../services/pizza/pizzaService.js";
import { FormValues } from "../../util/form.js";
import PaymentMethodField from "./PaymentMethodField.js";

export default function PaymentSettings(props: { values?: FormValues }) {
	return (
		<section class="admin-settings-payments">
			<h2>Ways to pay</h2>
			<p class="admin-card-description">Cash is always available. Enable any additional methods you want to accept.</p>
			<div class="admin-payment-grid">
				{PizzaService.CONFIGURABLE_PAYMENT_METHODS.map(method => (
					<PaymentMethodField method={method} values={props.values} />
				))}
			</div>
		</section>
	);
}
