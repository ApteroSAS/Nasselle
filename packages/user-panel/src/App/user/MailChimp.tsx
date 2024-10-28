import React, { useEffect } from 'react';

const MailchimpEmbed: React.FC = () => {
    useEffect(() => {
        // Load the Mailchimp validation script dynamically
        const script = document.createElement('script');
        script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            // Initialize Mailchimp functionality after the script is loaded
            (function ($) {
                window.fnames = new Array();
                window.ftypes = new Array();
                fnames[0] = 'EMAIL';
                ftypes[0] = 'email';
            })(window.jQuery);
        };

        return () => {
            // Cleanup the script when component unmounts
            document.body.removeChild(script);
        };
    }, []);

    const rawHTML = `
    <div id="mc_embed_shell">
      <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css">
      <style type="text/css">
        #mc_embed_signup{background:#fff; false;clear:left; font:14px Helvetica,Arial,sans-serif; width: 600px;}
      </style>
      <div id="mc_embed_signup">
        <form action="https://nasselle.us12.list-manage.com/subscribe/post?u=6022a92dc567b54c84c048aca&amp;id=937bf594ca&amp;f_id=00c20ee9f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank">
          <div id="mc_embed_signup_scroll">
            <h2>Subscribe</h2>
            <div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
            <div class="mc-field-group">
              <label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label>
              <input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required value="">
            </div>
            <div id="mce-responses" class="clear foot">
              <div class="response" id="mce-error-response" style="display: none;"></div>
              <div class="response" id="mce-success-response" style="display: none;"></div>
            </div>
            <div aria-hidden="true" style="position: absolute; left: -5000px;">
              <input type="text" name="b_6022a92dc567b54c84c048aca_937bf594ca" tabindex="-1" value="">
            </div>
            <div class="optionalParent">
              <div class="clear foot">
                <input type="submit" name="subscribe" id="mc-embedded-subscribe" class="button" value="Subscribe">
                <p style="margin: 0px auto;">
                  <a href="http://eepurl.com/iYKCn2" title="Mailchimp - email marketing made easy and fun">
                    <span style="display: inline-block; background-color: transparent; border-radius: 4px;">
                      <img class="refferal_badge" src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg" alt="Intuit Mailchimp" style="width: 220px; height: 40px; display: flex; padding: 2px 0px; justify-content: center; align-items: center;">
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

    return (
        <div
            dangerouslySetInnerHTML={{ __html: rawHTML }}
        />
    );
};

export default MailchimpEmbed;
