'use client';

import { useState } from 'react';
import { Calculator as CalcIcon, Delete, Divide, X, Minus, Plus, Equal } from 'lucide-react';

export default function Calculator() {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<string | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [newNumber, setNewNumber] = useState(true);

    const handleNumber = (num: string) => {
        if (newNumber) {
            setDisplay(num);
            setNewNumber(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const handleOperation = (op: string) => {
        const current = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(display);
        } else if (operation) {
            const result = calculate(parseFloat(previousValue), current, operation);
            setDisplay(String(result));
            setPreviousValue(String(result));
        }

        setOperation(op);
        setNewNumber(true);
    };

    const calculate = (a: number, b: number, op: string): number => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 0;
            case '%': return a % b;
            default: return b;
        }
    };

    const handleEquals = () => {
        if (operation && previousValue !== null) {
            const result = calculate(parseFloat(previousValue), parseFloat(display), operation);
            setDisplay(String(result));
            setPreviousValue(null);
            setOperation(null);
            setNewNumber(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setNewNumber(true);
    };

    const handleDecimal = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
            setNewNumber(false);
        }
    };

    const handleScientific = (func: string) => {
        const num = parseFloat(display);
        let result = 0;

        switch (func) {
            case 'sqrt': result = Math.sqrt(num); break;
            case 'square': result = num * num; break;
            case 'sin': result = Math.sin(num * Math.PI / 180); break;
            case 'cos': result = Math.cos(num * Math.PI / 180); break;
            case 'tan': result = Math.tan(num * Math.PI / 180); break;
            case 'log': result = Math.log10(num); break;
            case 'ln': result = Math.log(num); break;
        }

        setDisplay(String(result));
        setNewNumber(true);
    };

    type ButtonVariant = 'default' | 'operation' | 'equals' | 'clear' | 'scientific';

    interface ButtonProps {
        children: React.ReactNode;
        onClick: () => void;
        className?: string;
        variant?: ButtonVariant;
    }

    const Button = ({ children, onClick, className = '', variant = 'default' }: ButtonProps) => {
        const baseClass = 'p-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95';
        const variants: Record<ButtonVariant, string> = {
            default: 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800',
            operation: 'bg-blue-500 hover:bg-blue-600 text-white shadow-md',
            equals: 'bg-green-500 hover:bg-green-600 text-white shadow-md',
            clear: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
            scientific: 'bg-purple-500 hover:bg-purple-600 text-white text-sm shadow-md',
        };

        return (
            <button
                onClick={onClick}
                className={`${baseClass} ${variants[variant]} ${className}`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <CalcIcon className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Scientific Calculator</h2>
                </div>
                <p className="text-slate-600">Perform calculations for math, science, and more!</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
                {/* Display */}
                <div className="mb-6 p-6 bg-slate-900 rounded-lg">
                    <div className="text-right">
                        {previousValue && operation && (
                            <div className="text-slate-400 text-sm mb-1">
                                {previousValue} {operation}
                            </div>
                        )}
                        <div className="text-white text-4xl font-mono font-bold overflow-x-auto">
                            {display}
                        </div>
                    </div>
                </div>

                {/* Scientific Functions */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <Button variant="scientific" onClick={() => handleScientific('sin')}>sin</Button>
                    <Button variant="scientific" onClick={() => handleScientific('cos')}>cos</Button>
                    <Button variant="scientific" onClick={() => handleScientific('tan')}>tan</Button>
                    <Button variant="scientific" onClick={() => handleScientific('sqrt')}>√</Button>
                    <Button variant="scientific" onClick={() => handleScientific('square')}>x²</Button>
                    <Button variant="scientific" onClick={() => handleScientific('log')}>log</Button>
                    <Button variant="scientific" onClick={() => handleScientific('ln')}>ln</Button>
                    <Button variant="scientific" onClick={() => handleOperation('%')}>%</Button>
                </div>

                {/* Main Buttons */}
                <div className="grid grid-cols-4 gap-3">
                    <Button variant="clear" onClick={handleClear}>C</Button>
                    <Button variant="operation" onClick={() => handleOperation('/')}>÷</Button>
                    <Button variant="operation" onClick={() => handleOperation('*')}>×</Button>
                    <Button variant="operation" onClick={() => setDisplay(display.slice(0, -1) || '0')}>
                        <Delete className="w-5 h-5 mx-auto" />
                    </Button>

                    <Button onClick={() => handleNumber('7')}>7</Button>
                    <Button onClick={() => handleNumber('8')}>8</Button>
                    <Button onClick={() => handleNumber('9')}>9</Button>
                    <Button variant="operation" onClick={() => handleOperation('-')}>−</Button>

                    <Button onClick={() => handleNumber('4')}>4</Button>
                    <Button onClick={() => handleNumber('5')}>5</Button>
                    <Button onClick={() => handleNumber('6')}>6</Button>
                    <Button variant="operation" onClick={() => handleOperation('+')}>+</Button>

                    <Button onClick={() => handleNumber('1')}>1</Button>
                    <Button onClick={() => handleNumber('2')}>2</Button>
                    <Button onClick={() => handleNumber('3')}>3</Button>
                    <Button variant="equals" onClick={handleEquals} className="row-span-2">=</Button>

                    <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
                    <Button onClick={handleDecimal}>.</Button>
                </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-900">💡 Calculator Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use scientific functions for trigonometry, logarithms, and powers</li>
                    <li>• √ for square root, x² for squaring numbers</li>
                    <li>• sin, cos, tan work in degrees</li>
                    <li>• Perfect for math homework and science calculations!</li>
                </ul>
            </div>
        </div>
    );
}
