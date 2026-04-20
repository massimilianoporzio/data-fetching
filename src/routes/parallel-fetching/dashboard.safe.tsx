/*
 *   Copyright (c) 2026 Massimiliano Porzio
 *   All rights reserved.
 */
import { createFileRoute } from "@tanstack/react-router";

const getUser = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return { name: "Alice" };
};
const getAds = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	throw new Error("Failed to fetch ads - timeout");
};

export const Route = createFileRoute("/parallel-fetching/dashboard/safe")({
	component: RouteComponent,
	loader: async () => {
		const safeAdsPromise = getAds().catch((error) => {
			console.error("Error fetching ads:", error);
			return { text: "Upgrade to Premium to see ads" }; // Fallback data for ads
		});

		const [user, ads] = await Promise.all([getUser(), safeAdsPromise]);

		return { user, ads };
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	console.log(data);
	return (
		<main className="page-wrap px-4 py-12">
			<h1 className="text-3xl font-bold">{data.user.name}'s Dashboard</h1>
			<div className="mt-8 p 4 bg-gray-100 border text-gray-600">
				<p className="text-xs uppercase font-bold text-gray-400">
					Advertisment
				</p>
				<p>{data.ads.text}</p>
			</div>
		</main>
	);
}
