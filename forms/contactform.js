jQuery(document).ready(function ($) {
  "use strict";

  //Contact
  $("form.contactForm").submit(function (e) {
    e.preventDefault();
    var f = $(this).find(".form-group"),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
    f.children("input").each(function () {
      // run all inputs
      var i = $(this); // current input
      var rule = i.attr("data-rule");

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(":", 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case "required":
            if (i.val() === "") {
              ferror = ierror = true;
            }
            break;

          case "minlen":
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case "email":
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case "checked":
            if (!i.is(":checked")) {
              ferror = ierror = true;
            }
            break;

          case "regexp":
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next(".validation")
          .html(
            ierror
              ? i.attr("data-msg") !== undefined
                ? i.attr("data-msg")
                : "wrong Input"
              : ""
          )
          .show("blind");
      }
    });
    f.children("textarea").each(function () {
      // run all inputs

      var i = $(this); // current input
      var rule = i.attr("data-rule");

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(":", 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case "required":
            if (i.val() === "") {
              ferror = ierror = true;
            }
            break;

          case "minlen":
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next(".validation")
          .html(
            ierror
              ? i.attr("data-msg") != undefined
                ? i.attr("data-msg")
                : "wrong Input"
              : ""
          )
          .show("blind");
      }
    });
    if (ferror) return false;
    // Kiểm tra reCAPTCHA
    var recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse.length === 0) {
      $(".error-message").addClass("d-block").html("Vui lòng xác minh reCAPTCHA.");
      return false;
    }
    var str = $(this).serialize();
    var action = $(this).attr("action");
    if (!action) {
      action =
        "https://script.google.com/macros/s/AKfycbyUB_ueJ1-qnNobFNnJZtgLnNGCbyxLfgzyH6NZuuiRom8aDC5MTO3oLw3uQEhlna9uYQ/exec";
    }
    $(".loading").addClass("d-block");
    $(".error-message").removeClass("d-block");
    $(".sent-message").removeClass("d-block");
    $.ajax({
      type: "POST",
      url: action,
      data: str,
      success: function (msg) {
        if (msg.result == "success") {
          $(".loading").removeClass("d-block");
          $(".error-message").removeClass("d-block");
          $(".sent-message").addClass("d-block");
          $(".contactForm").find("input, textarea").val("");
        } else {
          $(".loading").removeClass("d-block");
          $(".error-message").addClass("d-block");
          $(".sent-message").removeClass("d-block");
          $(".error-message").html(msg.result);
        }
      },
    });
    return false;
  });
});
