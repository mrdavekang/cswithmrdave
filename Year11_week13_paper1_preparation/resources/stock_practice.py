def CountInStock(StockLevels):
    Count = 0
    for Quantity in StockLevels:
        if Quantity > 0:
            Count = Count + 1
    return Count

StockLevels = [0, 4, 2]
Result = CountInStock(StockLevels)
print(Result)
