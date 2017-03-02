function validate() {
  'use strict';
  // Look for ios devices and safari
  if (isMobileSafari()) {
    // Search for credit card input and change it to text field
    if ($('input#creditcard').length > 0) {
      $('input#creditcard').attr('type', 'text');
    }
  }
  if (!customWrapperForIsMobileDevice()) {
    $('input[type=number]').attr('type', 'text');
  }
  // Image lazyload
  $('img.lazy').lazyload({ skip_invisible: true });
  // X symbol for input fields
  if ($('.clearable').length > 0) {
    $('.clearable').addClear({
      closeSymbol: '&#10006;',
      color: '#CCC',
      top: '35px',
      right: '38px',
      returnFocus: true,
      showOnLoad: true,
      onClear: function ($input) {
        var formValidation = $input.closest('form').data('formValidation');
        if (formValidation) {
          formValidation.revalidateField($input.attr('name'));
        }
      },
      paddingRight: '55px',
      lineHeight: '1',
      display: 'block'
    });
  }
  // Mailcheck Plugin Code here
  if ($('#email').length > 0) {
    var domains = [
      'hotmail.com',
      'gmail.com',
      'aol.com'
    ];
    $('#email').on('blur', function () {
      $(this).mailcheck({
        domains: domains,
        suggested: function (element, suggestion) {
          $('#email + small').show();
          $('#email + small').text('Did you mean &lt;a href=\'javascript:void(0)\'\'&gt;' + suggestion.full + '&lt;&#x2F;a&gt;');
        },
        empty: function (element) {
        }
      });
    });
    // If user click on the suggested email, it will replace that email with suggested one.
    $('body').on('click', '#email + small a', function () {
      $('#email').val($(this).html());
      $('#email + small').hide();
      $('#email + small').html('Great! We will send you a confirmation e-mail with tracking # after purchasing.');
      if ($('form').length > 0) {
        $('form').formValidation('revalidateField', 'email');
      }
    });
  }
}
validate();