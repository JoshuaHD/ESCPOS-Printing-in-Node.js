Printer = require('./escpos_printing.js');

// SET This to the shared name of your printer
exports.selectedPrinter = 'GPRINTER'

exports.printFromArray = function printFromArray(printlines, cut = true) {
    Printer.ESCPOS_INIT();
    Printer.append(Printer.ESCPOS_CMD.RESET);

    for (let i = 0; i < printlines.length; i++) {
        Printer.append(printlines[i])
    }

    if (cut)
        Printer.append(Printer.ESCPOS_CMD.FEEDCUT_PARTIAL(100));

    var success = Printer.ESCPOS_PRINT(this.selectedPrinter);
    if (!success) {
        alert(Printer.ESCPOS_LASTERROR);
    }
}

exports.testPrintText = function () {
    let lines = []
    lines.push("Some text with the default print settings\n")
    lines.push("0123456789abcdefghijABCDEFGHIJ0123456789abcdefgh\n")

    this.printFromArray(lines)
}

exports.testPrintQrCodes = function () {
    let lines = []
    lines.push("Model 1 QR Code should open google.com\n")
    lines.push(Printer.ESCPOS_QRCODE("http://www.google.com", 49, 6, 48))

    lines.push("Model 2 QR Code should open google.com\n")
    lines.push(Printer.ESCPOS_QRCODE("http://www.google.com", 50, 6, 48))

    lines.push("Micro QR Code should open google.com\n")
    lines.push(Printer.ESCPOS_QRCODE("http://www.google.com", 51, 6, 48))

    lines.push("Micro QR Code size 10 should open google.com\n")
    lines.push(Printer.ESCPOS_QRCODE("http://www.google.com", 51, 10, 48))

    lines.push("Micro QR Code size 14 should open google.com\n")
    lines.push(Printer.ESCPOS_QRCODE("http://www.google.com", 51, 14, 48))

    lines.push(Printer.ESCPOS_CMD.CENTER)
    lines.push("Micro QR Code size 6 centered\nshould open google.com\n")
    lines.push(Printer.ESCPOS_QRCODE("http://www.google.com", 51, 6, 48))

    lines.push(Printer.ESCPOS_CMD.RIGHT)
    lines.push("Micro QR Code size 6 centered\nshould open google.com\n")
    lines.push(Printer.ESCPOS_QRCODE("http://www.google.com", 51, 6, 48))

    this.printFromArray(lines)
}

exports.testPrintBarcodes = function () {
    let lines = []

    let tests = {
        UPC_A: ["123456789012"],
        UPC_B: ["01234567891"],
        EAN_13: ["1234567890128", "210987654321"],
        EAN_8: ["12345670", "7654321"],
        Code39: ["123450", "ABC123"],
        Interleaved_2of5: ["12345678"],
        Codabar: ["A1234567890B"],
        Code_93: ["12345678"],
        Code_128: ["12345678", "{C12345678", "TestABC123"],
        UCC_Ean_128: ["0101234567890128TEC-IT"],
    }
    // Code 128
    
    lines.push(Printer.ESCPOS_CMD.BOLD)
    lines.push("invalid barcode contents can lead to wrong or no print\n\n")
    lines.push(Printer.ESCPOS_CMD.NORMAL)
    
    lines.push("When printing barcodes make sure to have a leading \\n \n\n")
    for (var code in tests) {
        if (!tests.hasOwnProperty(code)) {
            //The current property is not a direct property of p
            continue;
        }
        for (let i=0;i<tests[code].length;i++){  
            lines.push("Trying code " + code + " = " + tests[code][i] + "\n")          
            lines.push(Printer.MAKE_BARCODE[code](tests[code][i]))
        }
    }

    this.printFromArray(lines)
}
