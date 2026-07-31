import Core from "../../../../core.js";
import StakeTableContent from "./StakeTableContent.js";

export default function StakesTable() {
	const pizza = Core.services.pizza;

	return (
		<section class="admin-stakes">
			<h2>Current stakes ({pizza.stakes.length})</h2>
			{pizza.stakes.length ? (
				<div class="admin-stakes-table">
					<table class="canonical wide">
						<StakeTableContent />
					</table>
				</div>
			) : (
				<p class="admin-stakes-empty">No stakes yet.</p>
			)}
		</section>
	);
}
