import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const TaxVerify = () => {
    const { id } = useParams();
    const [result, setResult] = useState( null );

    useEffect( () => {
        if ( !id ) return;

        const verifyPayment = async () => {
            const response = await api.get( `/payments/verify/${id}` );
            console.log( response.data.data );
            setResult( response.data.data );
        };

        verifyPayment();
    }, [id] );

    if ( !result ) return <div className="p-10">Reconciling payment...</div>;

    const db = result.databaseRecord;
    const chain = result.onChainRecord;

    const blockchainDate = chain?.timestamp
        ? new Date( chain.timestamp * 1000 ).toLocaleString()
        : "Not Available";

    const isSuccess = result.status === "RECONCILED";

    return (
        <div className="flex justify-center bg-gray-100 min-h-screen p-6">
            <div className="bg-white w-full max-w-3xl shadow-lg rounded-lg p-8">

                {/* HEADER */}
                <div className="text-center border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold">EBONYI STATE IGR</h1>
                    <p className="text-sm text-gray-500">
                        Payment Reconciliation & Blockchain Verification
                    </p>
                </div>

                {/* STATUS BANNER */}
                <div
                    className={`p-4 rounded mb-6 text-center font-semibold ${isSuccess
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    {result.message}
                </div>

                {/* DATABASE RECORD */}
                <Section title="Database Record">
                    <Row label="Receipt ID" value={db.id} />
                    <Row label="User" value={db.userName} />
                    <Row label="Business" value={db.businessName} />
                    <Row label="Revenue Type" value={db.revenueType} />
                    <Row label="Amount" value={`₦${Number( db.amount ).toLocaleString()}`} />
                    <Row label="Period" value={`${db.period} (${db.periodReference})`} />
                    <Row label="Date" value={new Date( db.createdAt ).toLocaleString()} />
                    <Row label="Blockchain Hash" value={db.blockchainTxHash} mono />
                </Section>

                {/* BLOCKCHAIN RECORD */}
                <Section title="Blockchain Record">
                    <Row label="Revenue Type" value={chain.revenueType} />
                    <Row label="Amount" value={`₦${Number( chain.amount ).toLocaleString()}`} />
                    <Row label="Period" value={`${chain.period} (${chain.periodReference})`} />
                    <Row label="Recorded By" value={chain.recordedBy} mono />
                    <Row label="Timestamp" value={blockchainDate} />
                </Section>

                {/* FOOTER */}
                <div className="text-center border-t mt-6 pt-4 text-xs text-gray-500">
                    Blockchain verification ensures payment integrity and prevents record tampering
                </div>

                {/* PRINT BUTTON */}
                <div className="text-center mt-6 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-green-900 text-white rounded"
                    >
                        Print Verification
                    </button>
                </div>
            </div>
        </div>
    );
};

const Section = ( { title, children } ) => (
    <div className="mb-6">
        <h2 className="font-bold text-gray-700 mb-3">{title}</h2>
        <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
            {children}
        </div>
    </div>
);

const Row = ( { label, value, mono } ) => (
    <div className="flex justify-between gap-4">
        <span className="text-gray-600">{label}</span>
        <span className={`text-right ${mono ? "font-mono text-xs" : ""}`}>
            {value || "Not Available"}
        </span>
    </div>
);

export default TaxVerify;