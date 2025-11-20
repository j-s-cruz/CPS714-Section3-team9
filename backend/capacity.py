class CapacityTracker:
    MAX_CAPACITY = 10

    def __init__(self):
        self.stack = []

    def check_in(self, member_id):
        if len(self.stack) >= self.MAX_CAPACITY:
            return False
        if member_id in self.stack:
            return False
        self.stack.append(member_id)
        return True

    def check_out(self, member_id):
        if member_id in self.stack:
            self.stack.remove(member_id)
            return True
        return False

    def get_status(self):
        count = len(self.stack)

        if count < 3:       # under 3 people checked in
            return "Quiet"
        elif count < 7:     # 3–7 people checked in
            return "Busy"
        else:                # 7+ checked in
            return "Packed"

    def get_count(self):
        return len(self.stack)

    def get_members(self):
        return list(self.stack)



# Tests
if __name__ == "__main__":
    print("=== Running CapacityTracker Tests ===")

    # 1. Test normal check-in
    t1 = CapacityTracker()
    assert t1.check_in("M001") == True
    assert t1.get_count() == 1
    print("Test 1 passed: Normal check-in")

    # 2. Prevent double check-in
    t2 = CapacityTracker()
    t2.check_in("M001")
    assert t2.check_in("M001") == False
    assert t2.get_count() == 1
    print("Test 2 passed: Prevent double check-in")

    # 3. Normal check-out
    t3 = CapacityTracker()
    t3.check_in("M001")
    assert t3.check_out("M001") == True
    assert t3.get_count() == 0
    print("Test 3 passed: Normal check-out")

    # 4. Check-out when not inside
    t4 = CapacityTracker()
    assert t4.check_out("M002") == False
    print("Test 4 passed: Check-out of non-present member")

    # 5. Quiet status
    t5 = CapacityTracker()
    t5.check_in("M002")
    t5.check_in("M003")
    assert t5.get_status() == "Quiet"
    print("Test 5 passed: Quiet status")

    # 6. Busy status
    t6 = CapacityTracker()
    for i in range(5):
        t6.check_in(f"{i}")
    assert t6.get_status() == "Busy"
    print("Test 6 passed: Busy status")

    # 7. Packed status
    t7 = CapacityTracker()
    for i in range(8):
        t7.check_in(f"{i}")
    assert t7.get_status() == "Packed"
    print("Test 7 passed: Packed status")

    print("\n=== All Tests Passed Successfully ===")
