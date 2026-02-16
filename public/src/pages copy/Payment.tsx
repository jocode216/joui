import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { banks } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, CheckCircle } from 'lucide-react';

const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product } = useProduct(Number(id));
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bank, setBank] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bank || !transactionId || !phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: 'Order placed successfully!',
      description: 'We will verify your payment and process your order.',
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding py-16">
          <div className="container mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-semibold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We will verify your payment and update you on the status.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard">
                <Button className="w-full btn-brand">View My Orders</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding py-8">
        <div className="container mx-auto max-w-lg">
          <Link
            to={`/product/${id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Product
          </Link>

          <h1 className="text-2xl font-semibold mb-2">Complete Your Order</h1>
          <p className="text-muted-foreground mb-8">
            Please provide your payment details to complete the order.
          </p>

          {product && (
            <div className="card-minimal p-4 mb-8 flex items-center gap-4">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium line-clamp-1">{product.title}</h3>
                <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bank">Bank Name</Label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {banks.map((bankName) => (
                    <SelectItem key={bankName} value={bankName}>
                      {bankName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter your transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="w-full btn-brand">
              Confirm Payment
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Payment;
