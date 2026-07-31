import Core from "../../../core.js";
import ThermometerGoalMarker from "./ThermometerGoalMarker.js";

export default function ThermometerGoalMarkers() {
	const pizza = Core.services.pizza;

	return (
		<div class="thermometer-goals">
			{pizza.goalValues.map(goal => (
				<ThermometerGoalMarker goal={goal} stakeGoal={pizza.stakeGoal} />
			))}
		</div>
	);
}
