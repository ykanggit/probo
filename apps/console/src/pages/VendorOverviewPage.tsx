"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle } from "lucide-react"
import { graphql, PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay"
import { Suspense, useEffect } from "react"
import type { VendorOverviewPageQuery as VendorOverviewPageQueryType } from "./__generated__/VendorOverviewPageQuery.graphql"
import { useParams } from "react-router";

const VendorOverviewPageQuery = graphql`
  query VendorOverviewPageQuery($vendorId: ID!) {
    node(id: $vendorId) {
      ... on Vendor {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`

function VendorOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery(VendorOverviewPageQuery, queryRef);
  const [riskLevel, setRiskLevel] = useState("medium")

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G4dMt0eis6LFLrCaYPeMr7Nkt2iPoj.png"
              alt="Google Cloud"
              className="h-8 w-8"
            />
            <h1 className="text-xl font-semibold text-gray-900">{data.node?.name}</h1>
          </div>
          <p className="text-gray-600">Use this form to assess the risk of using Google Workspace as a vendor.</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Asset Storage Type</h2>
              <p className="text-sm text-gray-500">Questions related to the type of assets stored by the vendor.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <Label className="text-sm">Does this vendor store physical or digital assets?</Label>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">Digital</button>
                <button className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-900">Physical</button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Data Storage and Handling</h2>
              <p className="text-sm text-gray-500">
                Questions related to the vendor's data storage and handling practices.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Does this vendor store production data?</Label>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">No</button>
                  <button className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-900">Yes</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Is the production data encrypted at rest?</Label>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">No</button>
                  <button className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-900">Yes</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Who has access to the production data?</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vendor-staff" defaultChecked />
                    <label
                      htmlFor="vendor-staff"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Vendor Staff
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="third-parties" />
                    <label
                      htmlFor="third-parties"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Third Parties
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="automated-systems" />
                    <label
                      htmlFor="automated-systems"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Automated Systems
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Vendor Reliability and Continuity</h2>
              <p className="text-sm text-gray-500">
                Evaluating the vendor's reliability and plans for business continuity.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Does the vendor have an uptime commitment?</Label>
                </div>
                <RadioGroup defaultValue="greater" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="greater" id="greater" />
                    <Label htmlFor="greater">Greater than 99.9% uptime</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="between" id="between" />
                    <Label htmlFor="between">Between 99% and 99.9% uptime</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less" id="less" />
                    <Label htmlFor="less">Less than 99% uptime</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="na" id="na" />
                    <Label htmlFor="na">Not applicable</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Does the vendor have a disaster recovery plan?</Label>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">No</button>
                  <button className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-900">Yes</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Impact of a Data Breach or Outage</Label>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">Low</button>
                  <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">Medium</button>
                  <button className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-900">High</button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Risk level</h2>
              <p className="text-sm text-gray-500">Based on the responses, the suggested risk level is medium.</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">Low</button>
              <button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-900">Medium</button>
              <button className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-900">High</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function VendorOverviewPageFallback() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function VendorOverviewPage() {
  const { vendorId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<VendorOverviewPageQueryType>(VendorOverviewPageQuery);

  useEffect(() => {
    loadQuery({ vendorId: vendorId! });
  }, [loadQuery, vendorId]);

  if (!queryRef) {
    return <VendorOverviewPageFallback />;
  }

  return (
    <Suspense fallback={<VendorOverviewPageFallback />}>
      <VendorOverviewPageContent queryRef={queryRef} />
    </Suspense>
  );
}