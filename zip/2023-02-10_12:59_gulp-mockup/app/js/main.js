(function ($) {
  $(function () {

    function agChange () {
      var agPriceArr = [
        ['$19', '$54', '$89'],
        ['$12', '$36', '$56']
      ];

      if ($('#ag-month').is(':checked')) {
        agItem (agPriceArr[[0][0]]);
      } else if ($('#ag-year').is(':checked')) {
        agItem (agPriceArr[[1][0]]);
      }
    }

    function agItem (agArr) {
      for (var i = 0; i < agArr.length; i++) {
        $('.js-plan-item_sum:eq(' + i + ')').text(agArr[i]).addClass('js-ag-plan-item_sum');
      }
    }


    $('.ag-switch_input').on('change', function() {
      agChange ()
    });

    agChange ()


  });
})(jQuery);