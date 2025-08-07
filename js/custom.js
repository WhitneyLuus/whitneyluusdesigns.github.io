// Mobile Menu toggle btn functionality
$(document).ready(function () {
  $(".mobile-menu").on("click", function () {
    $(".mobile-nav").slideToggle();
  });
});

function startTechIconsMarquee(selector = '.tech-icon-container', duration = 20, ease = 'none') {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`startTechIconsMarquee: no element matches "${selector}"`);
    return;
  }

  // Prevent duplicate setups
  if (!container.dataset.marqueeInitialized) {
    // 1️⃣ Duplicate contents
    container.innerHTML += container.innerHTML;
    container.dataset.marqueeInitialized = 'true';
  }

  // 2️⃣ Compute half-width (one set)
  const singleWidth = container.scrollWidth / 2;

  // 3️⃣ Kill any prior tweens & restart
  gsap.killTweensOf(container);
  gsap.set(container, { x: 0 });

  gsap.to(container, {
    x: -singleWidth,
    ease,
    duration,
    repeat: -1
  });

  console.log('tech-icons:', {
    totalWidth: container.scrollWidth,
    singleWidth,
    visibleWidth: container.clientWidth
  });
}

// Link/Navigation/Download Functionality
function goTo(url, target, isDownload) {
  var e = window.event || arguments.callee.caller.arguments[0];
  target = target || '_self';

  if (isDownload) {
    // Create a temporary link element
    var link = document.createElement('a');
    link.href = url;
    link.download = ''; // You can specify a filename here if desired

    // Needed for Firefox:
    document.body.appendChild(link);

    // Simulate a click on the link
    link.click();

    // Cleanup
    document.body.removeChild(link);

    return;
  }

  // Navigation functionality
  if (target === '_self') {
    // same‐tab by default, but ctrl/cmd or middle click still open a new tab
    if (e && (e.ctrlKey || e.metaKey || e.button === 1)) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  } else {
    // any other target (e.g. "_blank" or "myTab") always opens via window.open
    window.open(url, target);
  }
}


// MAILING FORM HANDLER
$('#mailing_form').on('submit', function (event) {
  event.preventDefault();

  var email = $('#mailing_email').val().trim();

  if (!email) {
    $(".mailing-form-status").html("Email is required.").css('color', 'red');

    setTimeout(function () {
      $(".mailing-form-status").fadeOut("slow", function () {
        $(this).html('').show();
      });
    }, 1000);

    return;
  }

  var templateParams = { email: email };

  emailjs.send('service_i0ny6tl', 'template_dd3ioou', templateParams)
    .then(function () {
      $(".mailing-form-status").html("You've been added to the mailing list successfully.").css('color', 'var(--green)');

      setTimeout(function () {
        $(".mailing-form-status").fadeOut("slow", function () {
          $(this).html('').show();
        });
      }, 1000);
    }, function () {
      $(".mailing-form-status").html("Failed to add you to the mailing list.").css('color', 'var(--red)');

      setTimeout(function () {
        $(".mailing-form-status").fadeOut("slow", function () {
          $(this).html('').show();
        });
      }, 1000);
    });
});


// CONTACT FORM HANDLER
$('#contact_form').on('submit', function (event) {
  event.preventDefault();

  var name = $('#name').val().trim();
  var surname = $('#surname').val().trim();
  var number = $('#number').val().trim();
  var email = $('#email').val().trim();
  var message = $('#message').val().trim();

  if (!name || !email || !message) {
    var errorMsg = "";
    if (!name) errorMsg += "Name is required. ";
    if (!email) errorMsg += "Email is required. ";
    if (!message) errorMsg += "Message is required.";

    $(".form-status").html(errorMsg).css('color', 'var(--red)');

    setTimeout(function () {
      $(".form-status").fadeOut("slow", function () {
        $(this).html('').show();
      });
    }, 1000);

    return;
  }

  var templateParams = {
    name: name,
    surname: surname,
    number: number,
    email: email,
    message: message
  };

  emailjs.send('service_i0ny6tl', 'template_tcioscd', templateParams)
    .then(function () {
      $(".form-status").html("Your message was received!").css('color', 'var(--green)');

      setTimeout(function () {
        $(".form-status").fadeOut("slow", function () {
          $(this).html('').show();
        });
      }, 1000);
    }, function () {
      $(".form-status").html("Something went wrong!").css('color', 'var(--red)');

      setTimeout(function () {
        $(".form-status").fadeOut("slow", function () {
          $(this).html('').show();
        });
      }, 1000);
    });
});
