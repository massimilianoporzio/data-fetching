/*
 *   Copyright (c) 2026 Massimiliano Porzio
 *   All rights reserved.
 */

import { createServerFn } from "@tanstack/react-start";

export const getPokemonFn = createServerFn({
	method: "GET",
}).handler(async () => {
	console.log("Executing a secure database&API call on the server...");
	const response = await fetch("https://pokeapi.co/api/v2/pokemon/");
	const data = await response.json();
	console.log("Data successfully retrieved from the API on the server:", data);
	return data;
});

export const saveFavouritePokemonFn = createServerFn({
	method: "POST",
})
	.inputValidator((name: string) => name)
	.handler(async ({ data }) => {
		console.log(`Saving favourite pokemon on the server...`);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log("Favourite pokemon successfully saved on the server!");
		return { success: true, saved: data };
	});
