import { Children } from "@kitajs/html";

export function MainLayout(props: { children: Children }) {
	return (
		<div class="layout">
			<main id="main" class="main-content" hx-history-elt>
				{props.children}
			</main>
		</div>
	);
}
