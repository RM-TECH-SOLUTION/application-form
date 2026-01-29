"use client";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-red-200 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-pink-600 mb-2">
          Payment Successful 💖
        </h1>

        <p className="text-gray-600 mb-4" style={{fontWeight:"bold",fontSize:20}}>
          Your Valentine story has been created successfully.
        </p>

        <p className="text-sm text-gray-600 leading-relaxed">
          Your story link will be sent to your email ID within <b>2 hours</b>.
        </p>

        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          <b>Note:</b> If you do not receive the email within 2 hours, please write to  
          <br />
          <span className="font-medium text-pink-600">
            contact@rmtechsolution.com
          </span>{" "}
          or{" "}
          <span className="font-medium text-pink-600">
            rmtechsolution@gmail.com
          </span>
        </p>
      </div>
    </div>
  );
}
