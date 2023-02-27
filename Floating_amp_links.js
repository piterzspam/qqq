// ==UserScript==
// @name         Pływające linki do AMP
// @namespace    Violentmonkey Scripts
// @match        *://*/*
// @grant        none
// @setupURL     https://raw.githubusercontent.com/piterzspam/qqq/main/Floating_amp_links.js
// @exclude      https://www.google.com/recaptcha/*
// @exclude      https://*recaptcha.net/*
//
// ==/UserScript==
(function()
{
	'use strict';

	var currentUrl = location.href;
	//2*link[href][rel="canonical"] https://endler.dev/2022/readable/
	// Select all links with "canonical" or "amphtml" relation attributes
	var canonicalLink = document.querySelector('link[href][rel="canonical"]');
	var amphtmlLink = document.querySelector('link[href][rel="amphtml"]');

	// Filter out links with the same href as the current page
	var listUrlAndName = Array();
	/*.from(links)
		.filter(link => link.href !== currentUrl)
		.map(link => ({
			href: link.href,
			name: link.rel
		}));*/

	if (canonicalLink)
	{
		listUrlAndName.push(
		{
			href: canonicalLink.href,
			name: canonicalLink.rel,
		});
	}
	if (amphtmlLink)
	{
		listUrlAndName.push(
		{
			href: amphtmlLink.href,
			name: amphtmlLink.rel,
		});
		listUrlAndName.push(
		{
			href: getAmpGoogleUrl(amphtmlLink.href),
			name: "ampproject"
		});
	}
	else
	{
		var isAmpPage = (null !== document.querySelector('HTML[amp], HTML[\⚡]'));
		if (isAmpPage)
		{
			//https://www-gazetaprawna-pl.cdn.ampproject.org/v/s/www.gazetaprawna.pl/magazyn-na-weekend/artykuly/8667412,wojna-wybuch-doswiadczenie-ukraina-ukraincy.html.amp?amp_js_v=0.1
			var isAmpSubdomain = (new URL(currentUrl).hostname).endsWith('.cdn.ampproject.org');
			if (isAmpSubdomain)
			{
				listUrlAndName.push(
				{
					href: currentUrl,
					name: "ampproject"
				});
				var currentAmpprojectUrl = new URL(currentUrl);
				currentAmpprojectUrl.searchParams.delete('amp_js_v');
				var ampUrl = currentAmpprojectUrl.protocol + "//" + currentAmpprojectUrl.pathname.replace(/^\/v\/s\//, "");
				listUrlAndName.push(
				{
					href: ampUrl,
					name: "amphtml"
				});
			}
			else
			{
				listUrlAndName.push(
				{
					href: currentUrl,
					name: "amphtml"
				});

				listUrlAndName.push(
				{
					href: getAmpGoogleUrl(currentUrl),
					name: "ampproject"
				});
			}
		}
		else
		{
			var isOnetSubdomain = (new URL(currentUrl).hostname).endsWith('.onet.pl');
			if (canonicalLink && isOnetSubdomain)
			{
				var isCurrentSubdomainWwwOnetPl = (new URL(currentUrl).hostname).endsWith('www.onet.pl');
				if (!isCurrentSubdomainWwwOnetPl)
				{
					var ampUrl = canonicalLink.href + ".amp";
					listUrlAndName.push(
					{
						href: ampUrl,
						name: "amphtml",
					});
					listUrlAndName.push(
					{
						href: getAmpGoogleUrl(ampUrl),
						name: "ampproject",
					});
				}
			}
		}
	}

	if (listUrlAndName.length > 0)
	{
		listUrlAndName.push(
		{
			href: "https://archive.ph/" + currentUrl,
			name: "archive.ph"
		});
		listUrlAndName.push(
		{
			href: "https://readable.shuttleapp.rs/" + currentUrl,
			name: "readable"
		});
		listUrlAndName.push(
		{
			href: "https://12ft.io/" + currentUrl,
			name: "12ft.io"
		});
		var listUrlAndNameUnique = listUrlAndName.filter(link => link.href !== currentUrl);
		// Create the buttonsHolder element
		var buttonsHolder = document.createElement('div');
		buttonsHolder.id = 'buttonsHolder';
		buttonsHolder.style.position = "fixed";
		buttonsHolder.style.bottom = "0";
		buttonsHolder.style.left = "0";
		buttonsHolder.style.width = "auto";
		buttonsHolder.style.height = "auto";
		buttonsHolder.style.backgroundColor = "#fff";
		buttonsHolder.style.padding = "10px";

		buttonsHolder.style.borderTop = "10px solid black";
		buttonsHolder.style.borderRight = "10px solid black";
		buttonsHolder.style.zIndex = "9147483547";
		document.body.appendChild(buttonsHolder);

		// Add a button to remove buttonsHolder
		var closeButton = document.createElement('button');
		closeButton.innerHTML = "X";
		closeButton.style.float = "right";
		//closeButton.style.backgroundColor = "transparent";
		//closeButton.style.border = "none";
		closeButton.style.fontSize = "24px";
		closeButton.style.cursor = "pointer";
		closeButton.style.filter = "none !important";
		//filter: blur(0px);
		closeButton.addEventListener('click', () => buttonsHolder.remove());
		buttonsHolder.appendChild(closeButton);

		var detailsElem = document.createElement('details');
		var summaryElem = document.createElement('summary');
		summaryElem.textContent = "Linki";
		detailsElem.appendChild(summaryElem);


		// Create the list of links in buttonsHolder
		var linksList = document.createElement('ul');
		detailsElem.appendChild(linksList);
		buttonsHolder.appendChild(detailsElem);
		//linksList.style.listStyle = 'none';
		//linksList.style.margin = '0';
		//linksList.style.padding = '0';



		// Add links to linksList
		listUrlAndNameUnique.forEach(linkObj =>
		{
			var linkItem = document.createElement('li');
			var link = document.createElement('a');
			link.href = linkObj.href;
			link.innerText = linkObj.name;
			//link.target = '_blank';
			link.style.display = "block";
			link.style.filter = "none !important";

			link.style.padding = "5px 10px";
			link.style.color = "#000";
			link.style.backgroundColor = "#fff";
			link.style.textDecoration = "none";
			linkItem.appendChild(link);
			linksList.appendChild(linkItem);
		});

	}

	function getAmpGoogleUrl(url)
	{
		var regex = /(?<protocol>https?:\/\/)(?<domain>[^\/]+)\/(?<rest_of_url>.+)/;
		var
		{
			protocol,
			domain,
			rest_of_url
		} = url.match(regex).groups;
		var ampGoogleUrl = new URL(`${protocol}${domain.replace(/\./g, '-')}.cdn.ampproject.org/v/s/${domain}/${rest_of_url}`);

		ampGoogleUrl.searchParams.append("amp_js_v", "0.1");


		return ampGoogleUrl;
	}
})();
