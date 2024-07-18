$(document).ready(function() {
    // Set default headers for AJAX requests
    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Function to handle submission of license information
    window.submitLicenseInfo = function () {
        let licenseInfo = {
            licenseeName: $('#licenseeName').val(),
            assigneeName: $('#assigneeName').val(),
            expiryDate: $('#expiryDate').val()
        };
        localStorage.setItem('licenseInfo', JSON.stringify(licenseInfo));
        $('#mask, #form').hide();
    };

    // Function to handle search input
    $('#search').on('input', function(e) {
        $("#product-list").load('/search?search=' + e.target.value);
    });

    // Function to show license form
    window.showLicenseForm = function () {
        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        $('#licenseeName').val(licenseInfo?.licenseeName || 'ranging');
        $('#assigneeName').val(licenseInfo?.assigneeName || 'snail');
        $('#expiryDate').val(licenseInfo?.expiryDate || '2111-11-11');
        $('#mask, #form').show();
    };

    // Function to copy text to clipboard
    const copyToClipboard = async (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
            } catch (error) {
                alert("复制失败: " + error);
            }
        } else {
            // Fallback method
            let textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error("复制失败: ", err);
                alert("复制失败: " + err);
            }
            document.body.removeChild(textarea);
        }
    };

    // Function to show VM options
    window.showVmoptins = function () {
        const text = "-javaagent:/(Your Path)/ja-netfilter/ja-netfilter.jar\n" +
            "--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED\n" +
            "--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED";

        copyToClipboard(text);
    };

    // Function to copy license
    window.copyLicense = async function (e) {
        while (localStorage.getItem('licenseInfo') === null) {
            $('#mask, #form').show();
            await new Promise(r => setTimeout(r, 1000));
        }

        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        let productCode = $(e).closest('.card').data('productCodes');
        let data = {
            "licenseName": licenseInfo.licenseeName,
            "assigneeName": licenseInfo.assigneeName,
            "expiryDate": licenseInfo.expiryDate,
            "productCode": productCode,
        };

        try {
            let response = await $.post('/generateLicense', JSON.stringify(data));
            await copyToClipboard(response);
            e.dataset.content = "Copy Success!";

            // Add mouseleave event listener
            e.addEventListener('mouseleave', function handleMouseLeave() {
                e.dataset.content = "Copy to clipboard";
                // Remove the event listener after it has been triggered
                e.removeEventListener('mouseleave', handleMouseLeave);
            });
        } catch (error) {
            console.error("生成许可证失败: ", error);
            alert("生成许可证失败: " + error);
        }
    };
});
