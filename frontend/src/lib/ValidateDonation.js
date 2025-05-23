// lib/validateDonation.js
export const validateDonation = (data) => {
  return z.object({
    id: z.string().uuid(),
    amount: z.number().positive(),
    currency: z.enum(["RWF", "USD", "EUR"]),
    paymentMethod: z.string().min(3),
    status: z.enum(["pending", "success", "failed"]),
    createdAt: z.string().datetime(),
  }).safeParse(data);
};
  
// In DonationTable component
const { data: rawData } = useQuery(/* ... */);
  
const validatedData = useMemo(() => {
  return (rawData || []).filter(item => {
    const result = validateDonation(item);
    if (!result.success) console.error("Invalid donation:", item);
    return result.success;
  });
}, [rawData]);