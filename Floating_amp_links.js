// ==UserScript==
// @name         Pływające linki do AMP
// @namespace    Violentmonkey Scripts
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function() {
	'use strict';

	// Select all links with "canonical" or "amphtml" relation attributes
	const links = document.querySelectorAll('link[href][rel="canonical"], link[href][rel="amphtml"]');

	// Filter out links with the same href as the current page
	const list2 = Array.from(links)
		.filter(link => link.href !== location.href)
		.map(link => ({
			href: link.href,
			rel: link.rel
		}));

	if (list2.length > 0) {
    var elementsHtmlAmps = document.querySelectorAll('HTML[amp], HTML[\⚡]');
    var hostname = new URL(location.href).hostname;
    var isAmpSubdomain = hostname.endsWith('.cdn.ampproject.org');
    if (elementsHtmlAmps.length > 0 && !isAmpSubdomain)
    {
      list2.push({
		  	href: getAmpGoogleUrl(location.href),
		  	rel: "amphtml-Google"
		  })
    }
		// Create the buttonsHolder element
		const buttonsHolder = document.createElement('div');
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
		const closeButton = document.createElement('button');
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

		// Create the list of links in buttonsHolder
		const linksList = document.createElement('ul');
		//linksList.style.listStyle = 'none';
		//linksList.style.margin = '0';
		//linksList.style.padding = '0';
		buttonsHolder.appendChild(linksList);


		const ampButton = list2.find(x => x.rel === 'amphtml');
		if (ampButton) {
			//ampButton.href = getAmpGoogleUrl(ampButton.href);
			//ampButton.rel = "AMP-Googlexxxxxxxxxxxxxxxxx";
			list2.push({
			  href: getAmpGoogleUrl(ampButton.href),
			  rel: "amphtml-Google"
		});
		}
		// Add links to linksList
		list2.forEach(linkObj => {
			const linkItem = document.createElement('li');
			const link = document.createElement('a');
			link.href = linkObj.href;
			link.innerText = linkObj.rel;
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

	function getAmpGoogleUrl(url) {
		const regex = /(?<protocol>https?:\/\/)(?<domain>[^\/]+)\/(?<rest_of_url>.+)/;
		const {
			protocol,
			domain,
			rest_of_url
		} = url.match(regex).groups;
		const ampGoogleUrl = `${protocol}${domain.replace(/\./g, '-')}.cdn.ampproject.org/v/s/${domain}/${rest_of_url}`;
      const separator = ampGoogleUrl.includes('?') ? '&' : '?';

    const encodedKey = encodeURIComponent("amp_js_v");
    const encodedValue = encodeURIComponent("0.1");

    const newUrl = `${ampGoogleUrl}${separator}${encodedKey}=${encodedValue}`;
		return newUrl;
	}
})();
