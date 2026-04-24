/*
 *   Copyright (c) 2026 Massimiliano Porzio
 *   All rights reserved.
 */
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { Suspense } from "react";

const fetchProductDetails = async () => {
	await new Promise((resolve) => setTimeout(resolve, 100));
	return {
		name: "Pro Wireless Headphones",
		price: "$99.99",
		description: "This is an awesome product that you will love!",
	};
};

const fetchCustomerReviews = async () => {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return [
		{ id: 1, user: "Alice", rating: 5, comment: "Amazing headphones!" },
		{ id: 2, user: "Bob", rating: 4, comment: "Great sound quality." },
		{ id: 3, user: "Charlie", rating: 3, comment: "Good but a bit pricey." },
	];
};

export const Route = createFileRoute("/streaming-ssr/product")({
	component: RouteComponent,
	loader: async () => {
		const product = await fetchProductDetails();
		const reviewsPromise = defer(fetchCustomerReviews());

		return { product, reviewsPromise };
	},
});

function RouteComponent() {
	// data.product is a resolved object ready to use.
	// data.reviewsPromise is an unresolved promise.
	const data = Route.useLoaderData();

	return (
		<main className="max-w-2xl mx-auto py-12 px-4">
			{/* The awaited data renders instantly */}
			<h1 className="text-3xl font-bold">{data.product.name}</h1>
			<p className="text-xl text-green-700 mt-2">{data.product.price}</p>

			<hr className="my-8" />
			<h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

			{/* Wrap the deferred section in Suspense */}
			<div className="min-h-37.5">
				<Suspense fallback={<ReviewsSkeleton />}>
					{/* Pass the promise to the Await component */}
					<Await promise={data.reviewsPromise}>
						{/* nce the server finishes streaming, Await provides the data */}
						{(reviews) => (
							<ul className="space-y-4">
								{reviews.map((review) => (
									<li key={review.id} className="p-4 border rounded">
										<p className="font-bold">{review.user}</p>
										<p className="text-gray-700">{review.comment}</p>
									</li>
								))}
							</ul>
						)}
					</Await>
				</Suspense>
			</div>
		</main>
	);
}

function ReviewsSkeleton() {
	return (
		<div className="space-y-4">
			<div className="h-16 bg-gray-200 rounded animate-pulse"></div>
			<div className="h-16 bg-gray-200 rounded animate-pulse"></div>
		</div>
	);
}
