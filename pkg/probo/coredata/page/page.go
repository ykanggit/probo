package page

type (
	Paginable interface {
		CursorKey() CursorKey
	}

	PageInfo struct {
		HasNext bool
		HasPrev bool
	}

	Page[T Paginable] struct {
		Info *PageInfo
		Data []T
	}
)

func (p *Page[T]) First() T {
	if len(p.Data) == 0 {
		var zero T
		return zero
	}

	return p.Data[0]
}

func (p *Page[T]) Last() T {
	if len(p.Data) == 0 {
		var zero T
		return zero
	}

	return p.Data[len(p.Data)-1]
}

func NewPage[T Paginable](data []T, c *Cursor) *Page[T] {
	pi := &PageInfo{}

	if len(data) == 0 {
		return &Page[T]{
			Info: pi,
			Data: data,
		}
	}

	edges := data
	firstFromData := data[0]

	switch c.Position {
	case Head:
		if c.Key != nil {
			if len(edges) == c.Size+2 {
				edges = edges[1 : len(edges)-1]
			} else {
				edges = edges[1:]
			}
		} else if c.Key == nil && len(edges) == c.Size+1 {
			edges = edges[0 : len(edges)-1]
		}

		if c.Key != nil && *c.Key == firstFromData.CursorKey() {
			pi.HasPrev = true
		}

		if c.Key != nil && c.Size+2 == len(data) {
			pi.HasNext = true
		} else if c.Key == nil && c.Size+1 == len(data) {
			pi.HasNext = true
		}
	case Tail:
		for i, j := 0, len(edges)-1; i < j; i, j = i+1, j-1 {
			edges[i], edges[j] = edges[j], edges[i]
		}

		if c.Key != nil {
			if len(edges) == c.Size+2 {
				edges = edges[1 : len(edges)-1]
			} else {
				edges = edges[0 : len(edges)-1]
			}
		} else if c.Key == nil && len(edges) == c.Size+1 {
			edges = edges[1:]
		}

		if c.Key != nil && *c.Key == firstFromData.CursorKey() {
			pi.HasNext = true
		}

		if c.Key != nil && c.Size+2 == len(data) {
			pi.HasPrev = true
		} else if c.Key == nil && c.Size+1 == len(data) {
			pi.HasPrev = true
		}
	}

	return &Page[T]{
		Info: pi,
		Data: edges,
	}
}
