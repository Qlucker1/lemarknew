document.addEventListener('DOMContentLoaded', function() {

	if (document.querySelector('#calc-form')){
		document.querySelector('#calc-form').addEventListener('submit', function() {
		    gtag('event', 'hplPanelForm', {
		      'event_name': 'hpl_panel_form'
		    });
	  });
	}
  

	if (document.querySelector('#sertificates-form')){
		document.querySelector('#sertificates-form').addEventListener('submit', function() {
		    gtag('event', 'sertificatesForm', {
		      'event_name': 'sertificates_form'
		    });
		  });
	}
  

	if (document.querySelector('#rezume-form')){
		document.querySelector('#rezume-form').addEventListener('submit', function() {
	    gtag('event', 'rezumeForm', {
	      'event_name': 'rezume_form'
	    });
	  });
	}
  

	if (document.querySelector('#order-form2')){
		document.querySelector('#order-form2').addEventListener('submit', function() {
	    gtag('event', 'orderComparsionForm', {
	      'event_name': 'order_comparsion_form'
	    });
	  });
	}
  	
  	if (document.querySelector('#message-form1')){
  		document.querySelector('#message-form1').addEventListener('submit', function() {
    gtag('event', 'writeForm', {
      'event_name': 'write_form'
    });
  });
  	}

  
	if (document.querySelector('#order-form')){
		document.querySelector('#order-form').addEventListener('submit', function() {
    gtag('event', 'orderForm', {
      'event_name': 'order_form'
    });
  });
	}

  
	if (document.querySelector('#question-form')){
		document.querySelector('#question-form').addEventListener('submit', function() {
    gtag('event', 'questionForm', {
      'event_name': 'question_form'
    });
  });
	}

  	
  	if (document.querySelector('#subscribe-form')){
  		document.querySelector('#subscribe-form').addEventListener('submit', function() {
		    gtag('event', 'subscribeForm', {
		      'event_name': 'subscribe_form'
		    });
		  });
  	}

  
	if (document.querySelector('#subscribeFix-form')){
		document.querySelector('#subscribeFix-form').addEventListener('submit', function() {
    gtag('event', 'subscribeFixForm', {
      'event_name': 'subscribe_fix_form'
    });
  });
	}

  
  	if (document.querySelector('#production-form')){
  		document.querySelector('#production-form').addEventListener('submit', function() {
    if (window.location.href.includes('hpl-plastik-dlya-transporta')) {
      gtag('event', 'productionTransportForm', {
        'event_name': 'production_transport_form'
      });
    } else {
      gtag('event', 'productionForm', {
        'event_name': 'production_form'
      });
    }
  });
  	}

	if (document.querySelector('#pred-form')){
		document.querySelector('#pred-form').addEventListener('submit', function() {
	    gtag('event', 'predForm', {
	      'event_name': 'pred_form'
	    });
	  });
	}
	
	if (document.querySelector('#calc2-form')){
		document.querySelector('#calc2-form').addEventListener('submit', function() {
    if (window.location.href.includes('katalog-dekorov-hp')) {
      gtag('event', 'catalogHplPlastForm', {
        'event_name': 'catalog_hpl_plast_form'
      });
    } else {
      gtag('event', 'hplPlastForm', {
        'event_name': 'hpl_plast_form'
      });
    }
  });
	}
  

	if (document.querySelector('#callback-form')){
		document.querySelector('#callback-form').addEventListener('submit', function() {
	    gtag('event', 'callbackForm', {
	      'event_name': 'callback_form'
	    });
	  });

	}  

	if (document.querySelector('#message-form')){
		document.querySelector('#message-form').addEventListener('submit', function() {
	    gtag('event', 'messageForm', {
	      'event_name': 'message_form'
	    });
	  });
	}
  
  
  if (document.querySelectorAll('a[href^="mailto:"]')){
  	Array.from(document.querySelectorAll('a[href^="mailto:"]')).forEach(el => el.addEventListener('click', function() {
    gtag('event', 'emailClick', {
      'event_name': 'email_click'
    });
  }));
  }
  

  if (document.querySelectorAll('.footer__social__link')){
  	Array.from(document.querySelectorAll('.footer__social__link')).forEach(el => {
    if (el.href.includes('vk.com')) {
      el.addEventListener('click', function() {
        gtag('event', 'vkClick', {
          'event_name': 'vk_click'
        });
      }, false);
    } else if (el.href.includes('facebook.com')) {
      el.addEventListener('click', function() {
        gtag('event', 'fbClick', {
          'event_name': 'fb_click'
        });
      }, false);
    } else if (el.href.includes('instagram.com')) {
      el.addEventListener('click', function() {
        gtag('event', 'igClick', {
          'event_name': 'ig_click'
        });
      }, false);
    } else if (el.href.includes('youtube.com')) {
      el.addEventListener('click', function() {
        gtag('event', 'ytClick', {
          'event_name': 'yt_click'
        });
      }, false);
    } else if (el.href.includes('ok.ru')) {
      el.addEventListener('click', function() {
        gtag('event', 'okClick', {
          'event_name': 'ok_click'
        });
      }, false);
    } else if (el.href.includes('zen.yandex.ru')) {
      el.addEventListener('click', function() {
        gtag('event', 'zenClick', {
          'event_name': 'zen_click'
        });
      }, false);
    }
  });
  }

  
}, false);
