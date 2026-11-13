using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace B2303828.Models;
public class Transaction
{
    public string TransactionId { get; set; } = string.Empty;
    public string BookId { get; set; } = string.Empty;
    public int RequestQuantity { get; set; }
    public double Price { get; set; }
}
