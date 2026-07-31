import { FormValues } from "../../util/form.js";
import MainHeader from "./MainHeader.js";
import StakePanel from "./StakePanel.js";

export default function MainContent(props: { notice?: string; error?: string; values?: FormValues }) {
	return (
		<section class="main-page-left">
			<MainHeader />
			<StakePanel {...props} />
		</section>
	);
}
