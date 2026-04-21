/*
 *   Copyright (c) 2026 Massimiliano Porzio
 *   All rights reserved.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const departmentEnum = z.enum(["engineering", "hr", "all"]);

const employeeSearchSchema = z.object({
	page: z.number().catch(1),
	department: departmentEnum.catch("all"),
});

export const Route = createFileRoute("/loader-deps/employees")({
	validateSearch: employeeSearchSchema,
	component: RouteComponent,
	loaderDeps: ({ search }) => {
		const { page, department } = employeeSearchSchema.parse(search);
		return {
			page,
			department,
		};
	},
	loader: async ({ deps }) => {
		console.log(
			`Fetching employees for page ${deps.page} and department ${deps.department}...`,
		);
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			results: `Fetched employees for page ${deps.page} and department ${deps.department}`,
			timestamp: new Date().toLocaleTimeString(),
		};
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const departmentOptions = departmentEnum.options;
	const departmentLabels = {
		all: "All Departments",
		engineering: "Engineering",
		hr: "Human Resources",
	} satisfies Record<(typeof departmentOptions)[number], string>;

	const handleNextPage = () => {
		navigate({
			search: (prev) => ({
				...prev,
				page: prev.page + 1,
			}),
		});
	};

	const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const department = employeeSearchSchema.shape.department.parse(
			e.target.value,
		);

		navigate({
			search: (prev) => ({
				...prev,
				department,
				page: 1, // Always reset pagination to page 1 when a filter changes
			}),
		});
	};

	return (
		<main className="page-wrap px-4 py-12">
			<h1 className="text-3xl font-bold mb-6">Employee Directory</h1>

			<div className="flex gap-4 mb-8 p-4  border ">
				<div>
					<label htmlFor="dept-select" className="block text-sm font-bold mb-1">
						Filter by Department
					</label>
					<select
						id="dept-select"
						value={search.department}
						onChange={handleDepartmentChange}
						className="border p-2 rounded "
					>
						{departmentOptions.map((department) => (
							<option key={department} value={department}>
								{departmentLabels[department]}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="mb-8 p-6 bg-white border shadow-sm">
				<p className="text-lg font-medium text-blue-800">{data.results}</p>
				<p className="text-sm text-gray-500 mt-2">
					Data fetched at: {data.timestamp}
				</p>
			</div>

			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={() =>
						navigate({
							search: (prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }),
						})
					}
					className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-medium"
				>
					Previous
				</button>
				<span className="font-bold text-gray-700">Page {search.page}</span>
				<button
					type="button"
					onClick={handleNextPage}
					className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded font-medium"
				>
					Next
				</button>
			</div>
		</main>
	);
}
