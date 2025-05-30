package types

import (
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/page"
)

func NewAsset(asset *coredata.Asset) *Asset {
	return &Asset{
		ID:              asset.ID,
		Name:            asset.Name,
		Amount:          asset.Amount,
		Criticity:       asset.Criticity,
		AssetType:       asset.AssetType,
		DataTypesStored: asset.DataTypesStored,
		CreatedAt:       asset.CreatedAt,
		UpdatedAt:       asset.UpdatedAt,
	}
}

func NewAssetEdge(asset *coredata.Asset, orderField coredata.AssetOrderField) *AssetEdge {
	return &AssetEdge{
		Node:   NewAsset(asset),
		Cursor: asset.CursorKey(orderField),
	}
}

func NewAssetConnection(page *page.Page[*coredata.Asset, coredata.AssetOrderField]) *AssetConnection {
	edges := make([]*AssetEdge, len(page.Data))
	for i, asset := range page.Data {
		edges[i] = NewAssetEdge(asset, page.Cursor.OrderBy.Field)
	}

	return &AssetConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(page),
	}
}
