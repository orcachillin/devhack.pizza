import { FormValues } from "../../util/form.js";
import BuyerPaymentInfo from "../../shared/BuyerPaymentInfo.js";
import StakeFormColumn from "./StakeFormColumn.js";

export default function StakePanel(props: { notice?: string; error?: string; values?: FormValues }) {
	return (
		<div class="stake-panel">
			<hgroup>
				<h1>Stake for pizza</h1>
				<p>Select a payment method, and chose an amount.</p>
				<p>
					Notice: payment is not handled on this page. See payment information below for how to send money.
				</p>
			</hgroup>

			{props.notice && <blockquote aria-live="polite">{props.notice}</blockquote>}
			{props.error && (
				<blockquote class="error" aria-live="assertive">
					{props.error}
				</blockquote>
			)}

			<div class="stake-layout">
				<StakeFormColumn values={props.values} />
				<BuyerPaymentInfo />
			</div>
		</div>
	);
}
