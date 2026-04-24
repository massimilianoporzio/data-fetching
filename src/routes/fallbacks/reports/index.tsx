/*
 *   Copyright (c) 2026 Massimiliano Porzio
 *   All rights reserved.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fallbacks/reports/")({
	loader: async () => {
		await new Promise((resolve) => setTimeout(resolve, 5000));
		return { status: "Generated reports data", total: 150 };
	},
	component: RouteComponent,
	pendingComponent: ReportsPending,
	pendingMinMs: 1000,
	pendingMs: 500,
});

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<main className="page-wrap px-4 py-12">
			<h1 className="text-3xl font-bold mb-6">Financial Reports</h1>
			<div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm rounded">
				<p>
					Status:{" "}
					<span className="text-green-600 font-bold">{data.status}</span>
				</p>
				<p>Total Records: {data.total}</p>
			</div>
		</main>
	);
}

function ReportsPending() {
	return (
		<main className="page-wrap px-4 py-12">
			<h1 className="text-3xl font-bold mb-6 text-gray-400">
				Loading Reports...
			</h1>
			<div className="animate-pulse space-y-4">
				<div className="h-12 bg-gray-200 rounded w-full"></div>
				<div className="h-24 bg-gray-200 rounded w-full"></div>
			</div>
		</main>
	);
}
