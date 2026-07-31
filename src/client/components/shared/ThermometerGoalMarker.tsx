import { formatMoney } from "../util/money.js";

export default function ThermometerGoalMarker(props: { goal: { name: string; cost: number }; stakeGoal: number }) {
	return (
		<div class="thermometer-goal" style={`bottom:calc(${props.goal.cost / props.stakeGoal * 100}% - 1px)`}>
			<span class="thermometer-goal-label">
				<span>{props.goal.name}</span>
				<strong>${formatMoney(props.goal.cost)}</strong>
			</span>
		</div>
	);
}
