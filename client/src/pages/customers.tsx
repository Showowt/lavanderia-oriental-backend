import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  Plus,
  Phone,
  MessageSquare,
  ShoppingBag,
  User,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  StickyNote,
  Star,
  TrendingUp,
  Edit,
  ExternalLink
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  lifetimeValue?: number;
  lastOrderDate?: Date | null;
  preferredBranch?: string;
  isVip?: boolean;
  createdAt?: Date;
  tags?: string[];
}

interface CustomerDetail extends CustomerData {
  avgOrderValue: number;
  orderFrequency: string;
  recentOrders: { id: string; date: Date; amount: number; status: string; branch: string }[];
  conversationHistory: { id: string; date: Date; topic: string; resolution: string; handler: string }[];
  notes: { id: string; content: string; createdAt: Date; author: string }[];
}

export default function Customers() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: customers = [], isLoading } = useQuery<CustomerData[]>({
    queryKey: ["/api/customers"],
  });

  // Mock customer detail data
  const getCustomerDetail = (customer: CustomerData): CustomerDetail => ({
    ...customer,
    lifetimeValue: customer.lifetimeValue || (customer.totalOrders * 13.5),
    avgOrderValue: 13.35,
    orderFrequency: "2x/month",
    tags: customer.tags || ["Regular", "Delivery"],
    recentOrders: [
      { id: "#1234", date: new Date(2026, 1, 5), amount: 12.50, status: "completed", branch: "San Miguel" },
      { id: "#1198", date: new Date(2026, 0, 28), amount: 8.25, status: "completed", branch: "San Miguel" },
      { id: "#1156", date: new Date(2026, 0, 15), amount: 15.00, status: "completed", branch: "San Miguel" },
      { id: "#1089", date: new Date(2026, 0, 2), amount: 9.75, status: "completed", branch: "Santa Ana" },
    ],
    conversationHistory: [
      { id: "conv-1", date: new Date(2026, 1, 8), topic: "Pricing inquiry", resolution: "Resolved", handler: "AI" },
      { id: "conv-2", date: new Date(2026, 1, 1), topic: "Order status check", resolution: "Resolved", handler: "AI" },
      { id: "conv-3", date: new Date(2026, 0, 20), topic: "Complaint (damage)", resolution: "Escalated → Resolved", handler: "Human" },
    ],
    notes: [
      { id: "1", content: "Compensated $15 for damaged shirt", createdAt: new Date(2026, 0, 20), author: "Admin" },
      { id: "2", content: "Prefers pickup after 5pm", createdAt: new Date(2026, 0, 5), author: "María" },
      { id: "3", content: "Allergic to strong fragrances, use hypoallergenic", createdAt: new Date(2025, 11, 15), author: "Admin" },
    ],
  });

  const handleViewCustomer = (customer: CustomerData) => {
    setSelectedCustomer(getCustomerDetail(customer));
    setIsDetailOpen(true);
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch = branchFilter === "all" || customer.preferredBranch === branchFilter;

      return matchesSearch && matchesBranch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "orders":
          return (b.totalOrders || 0) - (a.totalOrders || 0);
        case "value":
          return (b.lifetimeValue || 0) - (a.lifetimeValue || 0);
        default: // recent
          return new Date(b.lastOrderDate || 0).getTime() - new Date(a.lastOrderDate || 0).getTime();
      }
    });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.isVip).length;
  const totalValue = customers.reduce((sum, c) => sum + (c.lifetimeValue || c.totalOrders * 13.5), 0);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("es-SV", { day: "numeric", month: "short" });
  };

  const formatFullDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-SV", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6" data-testid="customers-page">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Customers
          </h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Button className="gold-gradient" data-testid="button-add-customer">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers.toString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="VIP Customers"
          value={vipCustomers.toString()}
          icon={Star}
          variant="primary"
        />
        <StatCard
          title="Avg. Order Value"
          value="$13.35"
          icon={TrendingUp}
          variant="accent"
        />
        <StatCard
          title="Lifetime Value"
          value={`$${(totalValue / 1000).toFixed(1)}k`}
          icon={DollarSign}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-customers"
          />
        </div>
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-[180px]">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="San Miguel">San Miguel</SelectItem>
            <SelectItem value="Santa Ana">Santa Ana</SelectItem>
            <SelectItem value="Lourdes Colón">Lourdes Colón</SelectItem>
            <SelectItem value="Usulután">Usulután</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="orders">Most Orders</SelectItem>
            <SelectItem value="value">Highest Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No customers found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-center">Orders</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewCustomer(customer)}
                      data-testid={`customer-row-${customer.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {customer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{customer.name}</span>
                              {customer.isVip && (
                                <Badge className="bg-primary/20 text-primary border-0 text-xs px-1.5">
                                  <Star className="h-3 w-3 mr-0.5" />
                                  VIP
                                </Badge>
                              )}
                            </div>
                            {customer.email && (
                              <p className="text-xs text-muted-foreground">{customer.email}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{customer.phone}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {customer.preferredBranch || "San Miguel"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{customer.totalOrders || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(customer.lifetimeValue || customer.totalOrders * 13.5).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(customer.lastOrderDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <User className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedCustomer?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    {selectedCustomer?.name}
                    {selectedCustomer?.isVip && (
                      <Badge className="bg-primary/20 text-primary border-0">
                        <Star className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-normal text-muted-foreground">{selectedCustomer?.phone}</p>
                </div>
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            {selectedCustomer && (
              <div className="space-y-6 pb-6">
                {/* Contact & Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <SiWhatsapp className="h-4 w-4 text-green-500" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      {selectedCustomer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.preferredBranch || "San Miguel"}</span>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statistics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                          <p className="text-xs text-muted-foreground">Total Orders</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">${selectedCustomer.lifetimeValue?.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Lifetime Value</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">${selectedCustomer.avgOrderValue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Avg. Order</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="font-medium">{formatFullDate(selectedCustomer.createdAt)}</p>
                          <p className="text-xs text-muted-foreground">First Order</p>
                        </div>
                        <div>
                          <p className="font-medium">{formatDate(selectedCustomer.lastOrderDate)}</p>
                          <p className="text-xs text-muted-foreground">Last Order</p>
                        </div>
                        <div>
                          <p className="font-medium">{selectedCustomer.orderFrequency}</p>
                          <p className="text-xs text-muted-foreground">Frequency</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tags */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        + Add Tag
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Order History */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Order History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Branch</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{formatFullDate(order.date)}</TableCell>
                            <TableCell>{order.branch}</TableCell>
                            <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Conversation History */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Conversation History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Resolution</TableHead>
                          <TableHead>Handled By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.conversationHistory.map((conv) => (
                          <TableRow key={conv.id}>
                            <TableCell>{formatFullDate(conv.date)}</TableCell>
                            <TableCell>{conv.topic}</TableCell>
                            <TableCell>
                              <Badge variant={conv.resolution.includes("Escalated") ? "destructive" : "secondary"}>
                                {conv.resolution}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{conv.handler}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        Notes
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Note
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCustomer.notes.map((note) => (
                      <div key={note.id} className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatFullDate(note.createdAt)} - {note.author}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
