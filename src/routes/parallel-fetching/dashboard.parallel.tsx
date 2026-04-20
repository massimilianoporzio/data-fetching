/*
 *   Copyright (c) 2026 Massimiliano Porzio
 *   All rights reserved.
 */
import { createFileRoute } from "@tanstack/react-router";

const getUser = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return { name: "Alice" };
};
const getBilling = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return { status: "Active" };
};
const getStats = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return { visitors: 4200 };
};
export const Route = createFileRoute("/parallel-fetching/dashboard/parallel")({
	component: RouteComponent,
	loader: async () => {
		console.time("Parallel Total");
		const [user, billing, stats] = await Promise.all([
			getUser(),
			getBilling(),
			getStats(),
		]);

		console.timeEnd("Parallel Total");
		return { user, billing, stats };
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	console.log(data);
	return (
		<main className="page-wrap px-4 py-12">
			<h1 className="text-3xl font-bold">{data.user.name}'s Dashboard</h1>
			<p className="mt-4">Billing: {data.billing.status}</p>
			<p className="mt-4">Visitors: {data.stats.visitors}</p>
		</main>
	);
}
