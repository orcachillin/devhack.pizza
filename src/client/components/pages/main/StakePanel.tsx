import { FormValues } from "../../util/form.js";
import PaymentInfo from "./PaymentInfo.js";
import StakeFormColumn from "./StakeFormColumn.js";

export default function StakePanel(props: { notice?: string; error?: string; values?: FormValues }) {
	return (
		<div class="stake-panel">
			<hgroup>
				<h1>Stake for pizza</h1>
				<p>Choose how you will pay, identify yourself, and enter your stake.</p>
			</hgroup>

			{props.notice && <blockquote aria-live="polite">{props.notice}</blockquote>}
			{props.error && <blockquote class="error" aria-live="assertive">{props.error}</blockquote>}

			<div class="stake-layout">
				<StakeFormColumn values={props.values} />
				<PaymentInfo />
			</div>
		</div>
	);
}
