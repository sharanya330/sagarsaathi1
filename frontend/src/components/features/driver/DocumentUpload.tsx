"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const documentTypes = [
    { id: "license", label: "Driving License" },
    { id: "rc", label: "RC (Registration Certificate)" },
    { id: "insurance", label: "Insurance" },
    { id: "permit", label: "Permit" },
    { id: "selfie", label: "Selfie with Vehicle" },
]

export function DocumentUpload() {
    const [files, setFiles] = React.useState<Record<string, File>>({})
    const [uploading, setUploading] = React.useState(false)

    function handleFileChange(docType: string, file: File | null) {
        if (file) {
            setFiles(prev => ({ ...prev, [docType]: file }))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setUploading(true)

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            const formData = new FormData()
            formData.append('driverId', user._id)

            Object.entries(files).forEach(([key, file]) => {
                formData.append(key, file)
            })

            const response = await fetch('http://localhost:5001/api/drivers/documents', {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                toast.success("Documents uploaded successfully!")
                setFiles({})
                // Reset file inputs
                const form = e.target as HTMLFormElement
                form.reset()
            } else {
                const error = await response.json()
                toast.error(error.message || "Failed to upload documents")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setUploading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {documentTypes.map((doc) => (
                        <div key={doc.id} className="space-y-2">
                            <Label htmlFor={doc.id}>{doc.label}</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id={doc.id}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                                    className="flex-1"
                                />
                                {files[doc.id] && (
                                    <span className="text-sm text-green-600">✓ Selected</span>
                                )}
                            </div>
                        </div>
                    ))}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={uploading || Object.keys(files).length === 0}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Uploading..." : "Upload Documents"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
