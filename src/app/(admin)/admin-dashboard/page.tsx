'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2, RefreshCw, Search, CreditCard, } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatus, Payment } from "@/data/payment";
import { useAppContext } from "@/useContext/context";
import { toast } from "sonner";

export default function AdminPaymentsTable() {
    const navigate = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<"ALL" | PaymentStatus>("ALL");
    // const [adminToken, setAdminToken] = useState<string>('admin');

    const { payments, deletePayment, loading, fetchPayments } = useAppContext();

    const totalRevenue = payments.reduce<number>(
        (sum, payment) =>
            payment.status === "PAID" ? sum + payment.amount : sum,
        0
    );

    const totalPayments = payments.length;
    const paidPayments = payments.filter(p => p.status === "PAID").length;
    const pendingPayments = payments.filter(p => p.status !== "PAID").length;

    const filteredPayments = payments.filter((payment: Payment) => {
        const matchesSearch =
            payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.reference.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "ALL" || payment.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            toast.error(`Authorized! Only admin have access to the page`);
            navigate.replace("/home");
            return;
        }

        fetchPayments();
    }, []);


    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                    Loading payments...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Payment Management
                    </h1>

                    <Button variant="outline" size="sm" onClick={fetchPayments}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                    <p className="text-2xl font-bold mt-2">₦{totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <CreditCard className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Payments</p>
                                    <p className="text-2xl font-bold mt-2">{totalPayments}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <div className="text-blue-600 font-bold">TP</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Paid</p>
                                    <p className="text-2xl font-bold mt-2">{paidPayments}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Badge variant="default" className="h-8 w-8 flex items-center justify-center">
                                        ✓
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold mt-2">{pendingPayments}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Badge variant="secondary" className="h-8 w-8 flex items-center justify-center">
                                        !
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                <Card>
                    <CardContent className="flex gap-4 p-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, email, reference..."
                                className="pl-10"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) =>
                                setFilterStatus(e.target.value as "ALL" | PaymentStatus)
                            }
                            className="border rounded-md px-3"
                        >
                            <option value="ALL">All</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Records</CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredPayments.map((payment: Payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell>{payment.name}</TableCell>
                                        <TableCell>{payment.email}</TableCell>
                                        <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    payment.status === "PAID" ? "default" : "secondary"
                                                }
                                            >
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{payment.reference}</TableCell>
                                        <TableCell>
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="ghost">
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete Payment?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deletePayment(payment._id)}
                                                            className="bg-red-600"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
