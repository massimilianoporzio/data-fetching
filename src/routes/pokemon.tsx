/*
 *   Copyright (c) 2026 Massimiliano Porzio
 *   All rights reserved.
 */

import { createFileRoute } from "@tanstack/react-router";
import SkillCard from "#/components/SkillCard";
import { getPokemonFn } from "#/server/pokemon";

export const Route = createFileRoute("/pokemon")({
	component: RouteComponent,
	loader: async () => {
		// The loader calls the server function safely across the network
		const data = await getPokemonFn();
		return data;
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<h1>Hello World from Tanstack</h1>

			<ul className="mt-6 list-none p-0 space-y-5">
				{data.results.map((pokemon: { name: string }) => (
					<li key={pokemon.name}>
						<SkillCard name={pokemon.name} />
					</li>
				))}
			</ul>
		</main>
	);
}
