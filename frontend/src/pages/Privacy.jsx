import React from 'react';
import Title from '../components/Title';

const Privacy = () => {
  return (
    <div className="border-t pt-10 text-gray-700">
      <div className="text-2xl mb-6">
        <Title text1="PRIVACY" text2="POLICY" />
      </div>

      <div className="max-w-4xl space-y-8 text-sm leading-7">
        <section>
          <p>
            WolfFitness respects your privacy. This policy explains what information we collect,
            how we use it, and how we protect it when you use our website, shop, profile features,
            AI recommendations, and virtual try-on tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h2>
          <p>
            We may collect your name, email address, password, profile picture, fitness preferences,
            body measurements, cart details, orders, product views, recommendation feedback, and
            messages you submit through forms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</h2>
          <p>
            We use your information to create and secure your account, process orders, manage your
            cart, display your profile, recommend products, suggest sizes, improve virtual try-on
            results, and provide customer support.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Profile Photos And Try-On</h2>
          <p>
            If you upload a profile photo, it may be used for your account display and virtual
            try-on features. Product and profile images may be sent to our try-on service provider
            only when you choose to generate a try-on result.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies And Login Sessions</h2>
          <p>
            We use authentication cookies and local browser storage to keep you signed in, remember
            your cart, and support website functionality. You can clear browser storage or log out
            at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Protection</h2>
          <p>
            We use reasonable technical and organizational measures to protect your information.
            However, no online system is completely risk-free, so you should keep your password
            private and use a strong, unique password.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Choices</h2>
          <p>
            You can update your profile information, change or remove your profile photo, log out,
            or contact us to request help with your account information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h2>
          <p>
            If you have questions about this privacy policy, contact us at{' '}
            <a className="underline hover:text-gray-900" href="mailto:contact@wolfitness.com">
              contact@wolfitness.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
