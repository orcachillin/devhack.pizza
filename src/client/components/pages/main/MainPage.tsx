import Core from "../../../../core.js";
import Thermometer from "../../shared/Thermometer.js";
import { FormValues } from "../../util/form.js";
import MainContent from "./MainContent.js";

export default function MainPage(props: { notice?: string; error?: string; values?: FormValues } = {}) {
	const pizza = Core.services.pizza;

	return (
		<div class="main-page">
			<MainContent {...props} />
			<aside class="main-page-right" aria-label="Fundraising progress">
				<Thermometer height={pizza.stakeProgress} money={pizza.stakeValue} />
			</aside>
		</div>
	);
}
