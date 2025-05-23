import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import flutterwave from "@/assets/flutterwave2.png";
import irembo from "@/assets/irembo.jpeg";

const paymentProviders = [
  {
    value: "flutterwave",
    label: "Flutter",
    logos: [flutterwave],
    validate: (formData) => {
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return "Valid email required";
      }
      if (Number(formData.amount) < 100) {
        return "Minimum donation is 100 RWF";
      }
      return true;
    },
    supportedMethods: ["card", "mobilemoney", "ussd"],
  },
  {
    value: "irembo",
    label: "Irembo",
    logos: [irembo],
    supportedMethods: ["irembo"]
  },
];

export default function PaymentOptions({ method, setMethod }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Payment Method</label>
      <ToggleGroup
        type="single"
        value={method}
        onValueChange={setMethod}
        className="flex flex-wrap gap-2"
      >
        {paymentProviders.map(({ value, label, logos }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted"
            aria-label={`Select ${label} payment`}
          >
            <div className="flex gap-1 items-center">
              {logos.map((logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt={label}
                  className="h-4 w-auto"
                  loading="lazy"
                  draggable="false"
                />
              ))}
            </div>
            <span className="text-sm">{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
