
/* ------------------------------Navigation Menu ---------------------------*/
(()=>{
	const scrollcount = 0;
	const hamburgerBtn = document.querySelector(".hamburger-btn"),
	navMenu = document.querySelector(".nav-menu"),
	closeNavBtn = navMenu.querySelector(".close-nav-menu");

	hamburgerBtn.addEventListener("click",showNavMenu);
	closeNavBtn.addEventListener("click",hideNavMenu);

	function showNavMenu(){
		navMenu.classList.add("open");
		bodyScrollingToggle();
	}

	function hideNavMenu(){
		navMenu.classList.remove("open");
		fadeOutEffect();
		bodyScrollingToggle();
	}

	function fadeOutEffect(){
		document.querySelector(".fade-out-effect").classList.add("active");
		setTimeout(()=>{
			document.querySelector(".fade-out-effect").classList.remove("active");
		},300)
	}
	// Attach an event handler to document
	document.addEventListener("click",()=>{
		if(event.target.classList.contains('link-item')){
			/// make sure event.target has a value before overridding default behavior
			if(event.target.hash !==""){
				event.preventDefault();
				const hash = event.target.hash;
				// deactivate existing active sections
				document.querySelector(".section.active").classList.add("hide");
				document.querySelector(".section.active").classList.remove("active");
				// activate new section
				document.querySelector(hash).classList.add("active");
				document.querySelector(hash).classList.remove("hide");
				// deactivate existing active navigation menu 'link item'
				navMenu.querySelector(".active").classList.add("outer-shadow","hover-in-shadow");
				navMenu.querySelector(".active").classList.remove("active","inner-shadow");
				// if clicked linkitem is contained within the navigatin menu
				if(navMenu.classList.contains("open")){
					// activate new navigation menu linkitem
					event.target.classList.add("active","inner-shadow");
					event.target.classList.remove("outer-shadow","hover-in-shadow");
					// hide navigation menu
					hideNavMenu();
				}
				else{
					let navItems = navMenu.querySelectorAll(".link-item");
					navItems.forEach((item)=>{
						if(hash === item.hash){
							// activate new navigation menu linkitem
							item.classList.add("active","inner-shadow");
							item.classList.remove("outer-shadow","hover-in-shadow");
						}
					})
					fadeOutEffect();
				}
				// add hash (#) to url
				window.location.hash = hash;
			}
		}
	})
})();

/*--------------- about section tabs -----------------------------*/

(() =>{
	const aboutSection = document.querySelector(".about-section"),
	tabsContainer = document.querySelector(".about-tabs");

	tabsContainer.addEventListener("click",(event) =>{
		// if event.target contains tab item class and not contains active class;
		if(event.target.classList.contains("tab-item") && 
			!event.target.classList.contains("active")){
			const target = event.target.getAttribute("data-target");
			//deactivate existing active tab item
			tabsContainer.querySelector(".active").classList.remove("outer-shadow","active");
			// activate new tab content
			event.target.classList.add("active","outer-shadow");
			// deactivate existing active tab content
			aboutSection.querySelector(".tab-content.active").classList.remove("active");
			// activate new tab content
			aboutSection.querySelector(target).classList.add("active");
		}
	})
})();

function bodyScrollingToggle(){
	document.body.classList.toggle("hidden-scrolling");
}


// ------------------------------portfolio filter and popup -------------------//

(()=>{
	let imgfit;
	let scrollcount = 1;
	const div = document.querySelector(".innertestdiv");
	let divstyle = window.getComputedStyle(div);
	let imgstyle; 
	const filterContainer = document.querySelector(".portfolio-filter"),
	portfolioItemsContainer = document.querySelector(".portfolio-items"),
	portfolioItems = document.querySelectorAll(".portfolio-item"),
	popup = document.querySelector(".portfolio-popup"),
	prevBtn = popup.querySelector(".pp-prev"),
	nextBtn = popup.querySelector(".pp-next"),
	closeBtn = popup.querySelector(".pp-close"),
	projectDetailsContainer = popup.querySelector(".pp-details"),
	projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
	let itemIndex, slideIndex, screenshots;
	if(window.screen.width <= 1224){
		if(window.screen.width <= 710){
			imgfit = 1;
		}
		else{
			imgfit = 2;
		}
	}
	else{
		imgfit = 3;
	}

	// Filter portfolio items
	filterContainer.addEventListener("click", (event)=>{
		if(event.target.classList.contains("filter-item") && !event.target.classList.contains("active")){
			// deactivate existing active filter item
			filterContainer.querySelector(".active").classList.remove("outer-shadow","active");
			// activate new filter item
			event.target.classList.add("active","outer-shadow");
			const target = event.target.getAttribute("data-target");
			portfolioItems.forEach((item)=>{
				if(target === item.getAttribute("data-category") || target ==='all'){
					item.classList.remove("hide");
					item.classList.add("show");
				}
				else{
					item.classList.remove("show");
					item.classList.add("hide");
				}
			})
		}
	})

	portfolioItemsContainer.addEventListener("click", (event) =>{
		if (event.target.closest(".portfolio-item-inner")) {
			const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
			// get the portfolio item index
			itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
			screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
			// convert screenshots into array
			screenshots = screenshots.split(",");

			// Reset slideIndex and scrollcount when opening a new project
			slideIndex = 0;
			scrollcount = 1; // Clear out previous images in the slider div
			div.style.marginLeft = "0px";

			const popupImgContainer = popup.querySelector(".pp-img");
			popupImgContainer.innerHTML = ""; // Clear previous images

			if(screenshots.length === 1){
				prevBtn.style.display="none";
				nextBtn.style.display="none"
			}
			else{
				prevBtn.style.display="block";
				nextBtn.style.display="block"
			}
			popupToggle();
			popupSlideShow();
			popupDetails();
			popupDetailsToggle();
		}
	})

	closeBtn.addEventListener("click", ()=>{
		popupToggle();
		if(projectDetailsContainer.classList.contains("active")){
			popupDetailsToggle();
		}
		slideIndex = 0;
		scrollcount = 1; 
	})

	function popupToggle(){
		popup.classList.toggle("open");
		bodyScrollingToggle();
	}

	function popupSlideShow(){
		const imgSrc = screenshots[slideIndex];
		const popupImg = popup.querySelector(".pp-img");
		div.innerHTML = "";
		for(i=0;i<screenshots.length;i++){
			div.innerHTML += "<img src='"+ screenshots[i] +"' alt='img' class='pp-img outer-shadow'>"
		}
		imgstyle = window.getComputedStyle(div.querySelector(".pp-img"));

		// activate loader unitll the popupImg loaded
		popup.querySelector(".pp-loader").classList.add("active");
		popupImg.src=imgSrc;
		
		popupImg.onload = () =>{
			// deactivate loader after the popupImg loaded 
			popup.querySelector(".pp-loader").classList.remove("active");
		}
		popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
	}

	//  next slide
	nextBtn.addEventListener("click", ()=>{
		
		if(scrollcount <= screenshots.length - imgfit){
			div.style.marginLeft = ""+ parseInt(divstyle.marginLeft) - (parseInt(imgstyle.width) + (2*(parseInt(imgstyle.marginLeft))))+"px";
			scrollcount ++;
			slideIndex ++;
		}
		else{
			div.style.marginLeft = "0";
			scrollcount = 1;
			slideIndex =0;
		}
		updateCounter(); 
	})

	function updateCounter() {
		popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
	}

	//  prev slide
	prevBtn.addEventListener("click", ()=>{
		if(scrollcount > 1){
			div.style.marginLeft = "" + ( parseInt(divstyle.marginLeft) + (parseInt(imgstyle.width) + (2*(parseInt(imgstyle.marginLeft)))) ) + "px";
			scrollcount --;
			slideIndex --;
		}
		updateCounter(); 
	})

	function popupDetails(){
		//if portfolio item detail not exist i.e. if null
		if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
			projectDetailsBtn.style.display="none";
			return; //end function execution
		}
		projectDetailsBtn.style.display="block";
		//  get the project details
		const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
		// set the project details
		popup.querySelector(".pp-project-details").innerHTML = details;
		// get the prject title
		const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
		// set the prject title
		popup.querySelector(".pp-title h2").innerHTML = title;
		// get prject category
		const category = portfolioItems[itemIndex].getAttribute("data-category");
		// set project category
		popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
	}

	projectDetailsBtn.addEventListener("click", ()=>{
		popupDetailsToggle();
	})

	function popupDetailsToggle(){
		if(projectDetailsContainer.classList.contains("active")){
			projectDetailsContainer.classList.remove("active")
			projectDetailsContainer.style.maxHeight = 0 + "px";
			projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
			projectDetailsBtn.querySelector("i").classList.add("fa-plus");
		}else{
			projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
			projectDetailsBtn.querySelector("i").classList.add("fa-minus");
			projectDetailsContainer.classList.add("active");
			projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
			popup.scrollTo(0,projectDetailsContainer.offsetTop)
		}
	}
})();



// ------------------------------Testimonial slider -------------------//

(()=>{
	const sliderContainer = document.querySelector(".testi-slider-container"),
	slides = sliderContainer.querySelectorAll(".testi-item"),
	slideWidth = sliderContainer.offsetWidth,
	prevBtn = document.querySelector(".testi-slider-nav .prev"),
	nextBtn = document.querySelector(".testi-slider-nav .next"),
	activeSlide = sliderContainer.querySelector(".testi-item.active");
	
	let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);
	// set width of all slides
	 slides.forEach((slide) =>{
	 	slide.style.width = slideWidth +"px";
	 })
	 // set width of slider
	 sliderContainer.style.width = slideWidth * slides.length + "px";

	 nextBtn.addEventListener("click", () =>{
	 	if(slideIndex === slides.length-1){
	 		slideIndex =0;
	 	}
	 	else{
	 		slideIndex++;
	 	}
	 	 slider();
	 })

	  prevBtn.addEventListener("click", () =>{
	 	if(slideIndex === 0){
	 		slideIndex =slides.length-1;
	 	}
	 	else{
	 		slideIndex--;
	 	}
	 	slider();
	 })

	  function slider(){
	  	// deactivate existing active slides
	  	sliderContainer.querySelector(".testi-item.active").classList.remove("active");
	  	// activate new slide
	  	slides[slideIndex].classList.add("active");
	  	sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px";
	  }
	  slider();
	  

})();


//  ------------------------------
//  	Hide All Section except active
// ------------------------------------

(()=>{
	const sections = document.querySelectorAll(".section");
	sections.forEach((section)=>{
		if(!section.classList.contains("active")){
			section.classList.add("hide");
		}
	})

})();


window.addEventListener("load",()=>{
	//Preloader
	document.querySelector(".preloader").classList.add("fade-out");
	setTimeout(()=>{
		document.querySelector(".preloader").style.display="none";
	},600)
})