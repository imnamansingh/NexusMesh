#pragma once   

#include <vector>
#include <unordered_map>
#include <memory> 
#include "wifi_node.hpp"
#include "boundary.hpp"

class Quadtree {
private:
    //A static data member is shared by all instances of the class; there isn’t a separate copy in each object. Since it’s private, only Quadtree’s member functions can access it except the static member function because it has no this reference.
    static const int CAPACITY = 4;
    Boundary boundary;
    std::vector<InternalWifiNode*> nodes;
    bool divided = false;

    // C++ smart pointers manage dynamically allocated objects through RAII:
    // when the owning smart pointer is destroyed or reset, it releases its
    // resource automatically. Include <memory> to use the standard smart pointers.
    //
    // std::unique_ptr<T> represents exclusive ownership: only one unique_ptr
    // owns an object at a time. It cannot be copied, but ownership can be
    // transferred with std::move. Use std::make_unique<T>(...) to create one.
    // reset() replaces/releases its object; release() gives up ownership and
    // returns the raw pointer, so the caller must arrange to manage it.
    // std::unique_ptr<T[]> is the array specialization; prefer std::vector<T>
    // for resizable arrays. A custom deleter can be supplied for resources
    // that need cleanup other than delete (for example, a C library handle).
    // Here, each child Quadtree has exactly one owner: its parent node.
    // Destroying a Quadtree therefore destroys its child trees recursively.
    //
    // std::shared_ptr<T> represents shared ownership. It maintains a reference
    // count, and the object is destroyed when the last owning shared_ptr goes
    // away. Use std::make_shared<T>(...) for typical construction. Shared
    // ownership is useful when several independent parts of a program must
    // keep the same object alive, but it adds reference-counting overhead.
    // shared_ptr can also use a custom deleter. Avoid constructing multiple
    // shared_ptrs independently from the same raw pointer: that creates
    // separate ownership counts and can cause the object to be deleted twice.
    //
    // std::weak_ptr<T> is a non-owning reference to an object managed by
    // shared_ptr. It does not keep that object alive. Call lock() to obtain a
    // temporary shared_ptr; it will be empty if the object has expired.
    // weak_ptr is commonly used to break ownership cycles between shared_ptrs.
    //
    // Raw pointers (T*) and references (T&) do not own objects and do not
    // extend their lifetime. Use them for non-owning access when the owner's
    // lifetime is guaranteed to exceed the access. A raw pointer obtained from
    // smartPtr.get() is non-owning: do not delete it or keep it past the
    // smart pointer's lifetime. Prefer make_unique/make_shared over direct new.
    //
    // Prefer unique_ptr by default for dynamic ownership, shared_ptr only when
    // ownership is genuinely shared, and weak_ptr for non-owning links into a
    // shared_ptr-managed object. Avoid std::auto_ptr: it was deprecated and
    // removed from modern C++ because its copy behavior unexpectedly transferred
    // ownership. Smart pointers do not make access to the pointed-to object's
    // data automatically thread-safe.
    // The pointer variable itself may be const (for example, const unique_ptr<T>)
    // without making the pointed-to T const; use unique_ptr<const T> to prevent
    // modifying the object through that pointer.
    std::unique_ptr<Quadtree> nw, ne, sw, se;

    void subdivide();

public:
    Quadtree(Boundary b) : boundary(b) {}
    bool insert(InternalWifiNode* node);
    void query(const Boundary& range, std::vector<InternalWifiNode*>& found) const;
    bool remove(InternalWifiNode* node);
};
