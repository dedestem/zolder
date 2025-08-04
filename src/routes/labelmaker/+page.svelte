<script lang="ts">
	import { labels } from "$lib/stores/labels";
	import type { Label } from "$lib/types";
	import { Button, FlexWrapper, IconButton, LinkButton, Space, Modal } from "@davidnet/svelte-ui";
	import QRCode from "qrcode";

	let busyprint = false;
	let showDeleteAllLabelsModal = false;

	async function DeleteLabel(date: Date) {
		labels.update((current) => current.filter((label) => label.date !== date));
	}

	async function PrintLabels() {
		const printWindow = window.open("", "", "height=800,width=1100");
		if (!printWindow) return;
		busyprint = true;

		const chunkSize = 4;
		const chunks: (Label | null)[][] = [];
		const labelsCopy = [...$labels];

		while (labelsCopy.length > 0) {
			chunks.push(labelsCopy.splice(0, chunkSize));
		}

		// QR-code data URLs per label genereren
		const pagesHtml = await Promise.all(
			chunks.map(async (chunk) => {
				// vul aan tot 4
				while (chunk.length < chunkSize) {
					chunk.push(null);
				}

				const labelsHtml = await Promise.all(
					chunk.map(async (label) => {
						if (!label) return `<div class="print-label empty"></div>`;

						// Genereer QR code data URL
						const qrDataUrl = await QRCode.toDataURL(`https://zolder.internal/box/${label.id}`, {
							width: 150,
							margin: 1
						});

						return `
						<div class="print-label">
							<div class="label-id">#${label.id}</div>
							<img class="qr" src="${qrDataUrl}" alt="QR Code" />
							https://zolder.internal/box/${label.id}
							<div class="label-date">${label.date}</div>
						</div>
					`;
					})
				);

				return `
				<div class="page">
					${labelsHtml.join("")}
				</div>
			`;
			})
		);

		printWindow.document.write(`
			<html>
			<head>
				<title>Print Labels</title>
				<style>
				@page {
					size: A4 portrait;
					margin: 10mm 5mm 10mm 5mm;
				}
				html, body {
					width: 210mm;
					height: 297mm;
					margin: 0;
					padding: 0;
				}
				.page {
					display: grid;
					grid-template-columns: 1fr 1fr; /* 2 columns */
					grid-template-rows: 1fr 1fr;    /* 2 rows */
					gap: 10mm;
					height: 277mm; /* 297mm - 2*10mm margin */
					padding: 10mm 5mm;
					box-sizing: border-box;
					page-break-after: always;
				}
				.print-label {
					border: 10px solid black;
					border-radius: 12px;
					padding: 6mm;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					text-align: center;
					font-family: sans-serif;
					min-height: 0;
					min-width: 0;
				}
				.print-label.empty {
					border: none;
				}
				.label-id {
					font-size: 2.2rem;
					font-weight: bold;
					margin-bottom: 8mm;
				}
				.qr {
					width: 50mm;
					height: 50mm;
					margin-bottom: 4mm;
				}
				.label-date {
					font-size: 1rem;
					color: #333;
				}
				@media print {
					.page {
						page-break-after: always;
					}
					.print-label {
						page-break-inside: avoid;
					}
				}
				</style>
			</head>
			<body>${pagesHtml.join("")}</body>
			</html>
		`);

		printWindow.document.close();
		printWindow.focus();

		// Wait for all images to load before printing
		const images = printWindow.document.images;
		if (images.length === 0) {
			printWindow.print();
			printWindow.close();
			busyprint = false;
		} else {
			let loaded = 0;
			for (let i = 0; i < images.length; i++) {
				images[i].onload = () => {
					loaded++;
					if (loaded === images.length) {
						printWindow.print();
						printWindow.close();
						busyprint = false;
					}
				};
				images[i].onerror = () => {
					loaded++;
					if (loaded === images.length) {
						printWindow.print();
						printWindow.close();
						busyprint = false;
					}
				};
			}
		}
	}
</script>

{#if $labels.length}
	<div class="labels">
		{#each $labels as label (label.date)}
			<div class="label">
				Doos #{label.id}

				<IconButton
					icon="delete_forever"
					appearance="danger"
					alt="Verwijder label van print lijst."
					onClick={() => {
						DeleteLabel(label.date);
					}}
					loading={busyprint}
				/>
			</div>
		{/each}
	</div>

	<FlexWrapper direction="row" gap="10px">
		<Button loading={busyprint} appearance="primary" onClick={PrintLabels} iconbefore="print">Print labels</Button>

		<Button
			appearance="danger"
			onClick={() => {
				showDeleteAllLabelsModal = true;
			}}
			iconbefore="contract_delete"
		>
			Printlijst legen
		</Button>
		<Button
			appearance="subtle"
			onClick={() => {
				history.back();
			}}
			iconbefore="arrow_back"
		>
			Terug
		</Button>
	</FlexWrapper>
{:else}
	<h1>Geen labels in de labelmaker.</h1>
	<p>Voeg labels toe door op "Maak label" te klikken bij dozen.</p>
	<Space height="var(--token-space-6)" />
	<FlexWrapper direction="row" gap="10px">
		<LinkButton href="/" appearance="primary">Home</LinkButton>
		<Button
			appearance="subtle"
			onClick={() => {
				history.back();
			}}
		>
			Terug
		</Button>
	</FlexWrapper>
{/if}

{#if showDeleteAllLabelsModal}
	<Modal
		title="Printlijst legen?"
		titleIcon="contract_delete"
		desc="Alle labels van de print lijst verwijderen? Dit kan niet ongedaan worden."
		hasCloseBtn
		on:close={() => (showDeleteAllLabelsModal = false)}
		options={[
			{
				appearance: "danger",
				content: "Printlijst legen",
				onClick: () => {
					labels.set([]);
					showDeleteAllLabelsModal = false;
				}
			},
			{
				appearance: "subtle",
				content: "Annuleren",
				onClick: () => (showDeleteAllLabelsModal = false)
			}
		]}
	/>
{/if}

<style>
	.label {
		display: flex;
		flex-direction: row;
		background-color: var(--token-color-surface-sunken-normal);
		padding: 1rem 1rem;
		min-width: 16rem;
		margin: 0px;
		border-radius: 20px;
		align-items: center;
		justify-content: space-around;
	}

	.labels {
		display: flex;
		flex-direction: column;
		gap: var(--token-space-3);
		overflow-y: scroll;
		padding: 1rem;
	}
</style>
