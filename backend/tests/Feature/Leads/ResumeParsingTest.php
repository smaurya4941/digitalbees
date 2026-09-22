<?php

namespace Tests\Feature\Leads;

use App\Modules\Career\Services\ResumeParser;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use ZipArchive;

/**
 * Blueprint §28.2: resume-parse-to-prefill. Parsing is advisory — it must
 * return what it can and never throw.
 */
class ResumeParsingTest extends TestCase
{
    private function docx(string $body): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'cv').'.docx';
        $zip = new ZipArchive;
        $zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        $zip->addFromString('word/document.xml', '<w:document xmlns:w="w"><w:body>'.$body.'</w:body></w:document>');
        $zip->close();

        return new UploadedFile($path, 'cv.docx', null, null, true);
    }

    private function paragraphs(string ...$lines): string
    {
        return implode('', array_map(fn ($l) => "<w:p><w:r><w:t>{$l}</w:t></w:r></w:p>", $lines));
    }

    public function test_extracts_name_email_and_phone_from_a_header_block(): void
    {
        $result = (new ResumeParser)->extract("PRIYA NAIR\nSenior ML Engineer\npriya.nair@Example.com | +91 98765 43210\nGurugram, India");

        $this->assertSame('Priya Nair', $result['full_name']);
        $this->assertSame('priya.nair@example.com', $result['email']);
        $this->assertSame('+91 98765 43210', $result['phone']);
    }

    public function test_does_not_mistake_section_titles_or_year_ranges_for_contact_details(): void
    {
        $result = (new ResumeParser)->extract("Curriculum Vitae\nWork Experience\n2019 - 2023 Acme Corp");

        $this->assertArrayNotHasKey('full_name', $result);
        $this->assertArrayNotHasKey('phone', $result);
    }

    public function test_empty_text_yields_no_fields(): void
    {
        $this->assertSame([], (new ResumeParser)->extract('   '));
    }

    public function test_parses_a_docx_upload(): void
    {
        $file = $this->docx($this->paragraphs('Jamie Rivera', 'jamie@example.com', '(415) 555-0134'));

        $result = (new ResumeParser)->parse($file);

        $this->assertSame('Jamie Rivera', $result['full_name']);
        $this->assertSame('jamie@example.com', $result['email']);
        $this->assertSame('(415) 555-0134', $result['phone']);
    }

    public function test_a_corrupt_file_returns_an_empty_result_instead_of_throwing(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'cv').'.pdf';
        file_put_contents($path, 'not really a pdf');

        $this->assertSame([], (new ResumeParser)->parse(new UploadedFile($path, 'cv.pdf', null, null, true)));
    }

    public function test_the_endpoint_returns_prefill_fields(): void
    {
        $file = $this->docx($this->paragraphs('Jamie Rivera', 'jamie@example.com'));

        $this->postJson('/api/v1/careers/parse-resume', ['resume' => $file])
            ->assertOk()
            ->assertJsonPath('data.full_name', 'Jamie Rivera')
            ->assertJsonPath('data.email', 'jamie@example.com');
    }

    public function test_the_endpoint_rejects_disallowed_file_types(): void
    {
        $this->postJson('/api/v1/careers/parse-resume', [
            'resume' => UploadedFile::fake()->create('cv.exe', 10, 'application/octet-stream'),
        ])->assertStatus(422);
    }

    public function test_the_endpoint_requires_a_file(): void
    {
        $this->postJson('/api/v1/careers/parse-resume', [])->assertStatus(422);
    }
}
